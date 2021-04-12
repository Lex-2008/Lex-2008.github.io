title=Finding tar archive size without actually making it
intro=TL;DR: --totals --file=/dev/null | grep 'Total bytes written'
tags=bash
created=2016-07-21
modified=2016-10-31
modified_now=1


* * *

Since tar doesn't do any compression, it's possible to know **exact** size of tar archive without reading the files - just by looking at their sizes.
It's almost like arithmetical sum of all their sizes, but tar-specific - since tar also uses some blocks to encode file metadata and directory structure.

This can be useful, for example, if you're making a website with some files
and want to let users download whole folders as archives
without actually storing these archives on disk.

In that case you would probably use a script like this:

	#!/bin/sh
	echo "HTTP/1.0 200 OK"
	echo
	tar --create "path"

Which makes a basic HTTP response and pipes output of tar command.

But when downloading a file produced with such script you will notice absence of progress bar in your browser - because it doesn't know the size of the file it's downloading.
To fix it, you want to supply Content-Length header, with the size of the file.
And it must be **exact** size - otherwise browser will download incomplete file or report an error.

Turns out, it's possible to find the size of the tar archive **before** making the actual archive, and answer is in [this email][src] from 2007:
you just need to add `--totals --file=/dev/null` to the arguments of your tar command and look at the line containing `Total bytes written` text.

[src]: https://lists.gnu.org/archive/html/bug-tar/2007-01/msg00013.html

Like this:

	echo -n "Content-Length: "
	tar --create "path" --totals --file=/dev/null * 2>&1 | sed '/Total bytes written/!d;s/.*: \([0-9]*\) (.*/\1/'

As it's said in the email, it will tell you the size of resulting archive without reading actual files - just by looking at their sizes.
It still needs to read all directories, however.

* * *

To make your download script produce files with nice names, you can use Content-Disposition header:

	echo "Content-Disposition: filename=\"all.tar\""

And if you want to have better control of tree structure inside your archive, you might want to `cd` to target directory first:

	tar --create -C "path" '*'

or even

	tar --create -C "path/.." "$(basename "$path")"

so your archive contained only one item in its root, matching the name of the dir you're archiving.

Note that you probably must change both `tar` lines - the one which report the archive size and the one which makes the actual archive.
If the size advertised in Content-Length header doesn't match the actual archive size - it's better not to have it at all!
