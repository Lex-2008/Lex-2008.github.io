title=Transferring huge sparse files
intro=How to transfer a terabyte sparse file (of which only a hundred megabytes is used) from one machine to another
tags=Linux bash python
created=2020-01-24

Imagine that you've just created a huge filesystem image, for example like this:

	$ dd if=/dev/zero of=f count=0 bs=1M seek=1M 2>/dev/null
	$ mkfs.ext4 f >/dev/null
	$ ls -lh f
	-rw-rw-r-- 1 lex lex 1,0T jan.  26 18:25 f
	$ du --human-readable f
	139M	f

As you see, it actually takes only 139M of disk space, but from outside looks like a 1Tb file.
As a result, most of file-manipulation programs treat it as such.
Even those which claim support for such files (`cp --sparse=auto`, `rsync --sparse`, `dd conv=sparse`)
still check file sparseness by reading all file "holes" (areas of sparse file that are known not to contain any data) and checking that they are all zeroes.
Is it possible to do it better?

Yes, you just need to check file holes!

[sparseutils]: https://pypi.org/project/sparseutils/
[so]: https://unix.stackexchange.com/a/395051/328346

For this, you can use [sparseutils][] Python package (found via [this StackOverflow answer][so]), which prints data and hole areas of the file.
And below you can see a Python script which converts such output into two shell scripts:
first script converts your input sparse file into an intermediate non-sparse file with the size equal to disk space occupied by the sparse file (by eliminating all holes and squashing all data areas together),
and second restores original sparse file from the intermediate one.
This is the script:

	#!/usr/bin/python
	import sys
	pos_small=0
	pos_big=0

	# https://stackoverflow.com/a/18944210
	def gcd(x, y):
	    while y != 0:
	        (x, y) = (y, x % y)
	    return x

	def show(pos_big, pos_small, size):
	    c = gcd(pos_big, gcd(pos_small, size))
	    pos_big /= c
	    pos_small /= c
	    size /= c
	    if sys.argv[1] != '2':
	        print("dd if=$1 of=$2 bs=%d skip=%d seek=%d count=%d conv=nocreat,notrunc" %
		        (c, pos_big, pos_small, size))
	    else:
	        print("dd if=$1 of=$2 bs=%d skip=%d seek=%d count=%d conv=nocreat,notrunc" %
		        (c, pos_small, pos_big, size))

	if len(sys.argv) < 2:
	    print("Usage: %s 1-or-2" % sys.argv[0])
	    sys.exit(1)

	for line in sys.stdin:
	    what = line[:5]
	    size = int(line[5:])
	    if what == 'DATA ':
	        show(pos_big, pos_small, size)
	        pos_small += size
	    pos_big += size

And this is how you use it:

	$ python3 sparseutils/sparsemap.py f | ./script.py 1 >f1.sh
	$ touch f.x
	$ sh f1.sh f f.x 2>/dev/null
	$ ls -lh f.x
	-rw-rw-r-- 1 lex lex 139M jan.  26 18:53 f.x

As you can see, size of `f.x` file equals to disk usage of `f` file!

After that, you create a second script like this:

	$ python3 sparseutils/sparsemap.py f | ./script.py 2 >f2.sh

Transfer files `f2.sh` and `f.x` to the target computer, and create copy of file `f` like this:

	$ dd if=/dev/zero of=g count=0 bs=1M seek=1M 2>/dev/null
	$ sh f2.sh f.x g 2>/dev/null
	$ ls -lh g
	-rw-rw-r-- 1 lex lex 1,0T jan.  26 19:01 g
	$ du --human-readable g
	139M	g

<script src="/microlight.js"></script>
