title=How to download folder without creating archive
PROCESSOR=Markdown.pl
intro=TL;DR: use tar and pipe to stdout!
tags=bash
created=2018-06-22


Imagine that you're making some sort of web-based file tree navigator and want to let users download and upload individual files and whole directories.
While downloading individual files is pretty easy (just send the whole file with `application/octet-stream` content-type),
downloading directories gets more complicated, since there is no such option in HTTP protocol.
Obvious solution here is to create a (zip) archive here first, but note that it might be quite a heavy task, especially on a slow device like a cheap Android phone.

TAR to the rescue!
------------------

As you probably know, TAR is an archive format that doesn't have built-in compression - it just concatenates files
(well, plus adding some meta-information, like file names, modification times, and access permissions,
but that's not the point - important thing is that it doesn't do any compression).
In fact, you probably don't need any compression when downloading, for example, several gigabytes of photos from a slow Android phone.
Or, you can add extra layer of gzip compression above tar.

Pipe it!
--------

Also, can you download directory with 3Gb of photos if your phone has only 1Gb space left?
Instead of creating archive first, and downloading it as a second step, you should pipe it directly to the browser.

But what about size?
--------------------

If you simply try the above method, like this (here and below code snippets are in bash):

	echo "HTTP/1.0 200 OK"
	echo "Content-Disposition: filename=\"$dirname.tar\""
	echo
	tar --create "$path"

You will notice absence of progress bar and estimated remaining time in your browser.
It's because your browser doesn't know expected archive size before transfer begins.

**BUT TAR CAN CALCULATE IT FOR YOU!**

I actually haven't heard about such option in any of other formats
(because, indeed, how can you say what size of archive will be, without creating it?),
but tar can tell you size of archive just by looking at files,
if you pass it extra `--totals --file=/dev/null` arguments (you'll need to parse output, however), like this:

	echo "HTTP/1.0 200 OK"
	echo "Content-Disposition: filename=\"$dirname.tar\""
	echo -n "Content-Length: "
	tar --create "$path" --totals --file=/dev/null 2>&1 | sed '/Total bytes written/!d;s/.*: \([0-9]*\) (.*/\1/'
	echo
	tar --create "$path"

To those unfamiliar with bash: part after `2>&1 |` is just a bash way to extract required number from the tar output, it may be different in your programming languages.

Information about `--totals --file=/dev/null` trick was taken from [this][1] message.
[1]: https://lists.gnu.org/archive/html/bug-tar/2007-01/msg00013.html

