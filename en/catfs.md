title=catfs
intro=A FUSE module that shows a list of files as one big file.
tags=bash
created=2016-09-25
modified=2016-09-28
modified_now=1


**Imaginary usecase**:
Imagine that you have a 100Gb hard disk, where you have 75Gb of interesting files.
And someone asks you to send all of them as a single archive.
This archive will be about 75Gb also, and
obviously you can't create it because your hard disk has only 25Gb free space.

Maybe you can use [tarpipe][], but maybe you can't.

**Real usecase**:
Imagine that you're using [rsync backups][reason] and thus
your backups look like directories with hundreds of thousands of files in them.
And then you've [read][story] about [bit rot][rot] and want
to protect yourself against it by using [Parchive][par].

But par2 doesn't work with collections of more than 32k files!

[tarpipe]: https://en.wikipedia.org/wiki/Tar_(computing)#Tarpipe
[reason]: http://alexey.shpakovsky.ru/en/rsync-backups.html
[story]: https://pthree.org/2014/04/01/protect-against-bit-rot-with-parchive/
[rot]: https://en.wikipedia.org/wiki/Data_degradation
[par]: https://en.wikipedia.org/wiki/Parchive

Since there are reasons why I moved
from tar-style "whole backup in one file" backups
to rsync-style "individual files" backups
(mainly, for ease of recovering files and freeing space),
going back is not an option.

So it's naturally desired to have a virtual file system,
which will show you one huge file,
and map different parts of it to different real files.

That's what [catfs][github] is for.

It's code is quite small - less then 200 lines in total,
and usage is quite easy:

	find . -type f -printf "%s %P\n" >{list file}
	catfs {list file} {mount point}

First command generates list of files and their sizes,
and the second one mounts catfs to an (empty) directory.

In that folder, you'll see a big `archive.cat` file,
and if you look into it - you'll see all your files
_catenated_ together, like if you'd call `cat *`
(actually real command is a bit different,
since `*` and `find` show same file in different order,
but that's not the point). Hence the name.

Note that you can read it, but it doesn't occupy any real space on your disk.
Also you can't write to it, so you're safe to play with it :)

Why do you need to have a separate list file?
To make sure that if one of files is missing or truncated (has wrong size),
offsets of other files (their positions within the archive) don't change.
This is needed if you are recovering data -
otherwise, recovery program most probably will get confused :)

Example usage with par2
-----------------------

Let's go back to "real usecase" problem at the top and show
how it would be solved with catfs:

	cd backup/
	find . -type f -printf "%s %P\n" >cat.fs
	mkdir mount && catfs cat.fs mount
	par2create -r1 -n1 par2 mount/archive.cat
	fusermount -u mount && rmdir mount

i.e.:

* go to the directory (we'll be using relative paths)
* make list of files with the given format
* make temporary directory and mount catfs there
* create recovery files for the `archive.cat` file in that directory
* unmount catfs and remove temporary directory

After that, you'll see extra `cat.fs` and `par2*` files in
directory with your backup.
They are needed in case some files get lost or damaged,
so keep them.

In case of damage to any file (say, `important/data.txt`),
you can recover it this way:

	cd backup/
	mkdir mount && catfs cat.fs mount
	cp mount/archive.cat archive.cat
	fusermount -u mount && rmdir mount
	par2recover par2 archive.cat
	uncat.sh cat.fs archive.cat important/data.txt
	rm archive.cat

i.e.:

* go to the directory (again)
* make temporary directory and mount catfs there
* copy `archive.cat` out of the virtual file system
* unmount catfs and remove temporary directory
* recover broken `archive.cat` file
* extract recovered file from `archive.cat`
* delete `archive.cat` file if you don't need it

Note that this time, you have to copy whole archive.cat file
out of the virtual filesystem.
That's because catfs is a read-only file system
and under no circumstances will write to your files.

In last line you see a usage of `uncat.sh` script -
it's a very simple script which just runs `dd` to extract
data at a given offset to a file.

Are **you** protecting your backups against bit rot?
If yes, how?
Do you have any other comments?
Did you read the whole article?
Did you understand anything?
Please let me know what you think - even if you don't!
Send an email - address at the very bottom of this page.

Once again, [github link][github].

[SSFS by MaaSTaaR][SSFS] was the tutorial that convinced me that
writing my own file system is very easy :)


[SSFS]: http://www.maastaar.net/fuse/linux/filesystem/c/2016/05/21/writing-a-simple-filesystem-using-fuse/
[github]: https://github.com/Lex-2008/catfs
