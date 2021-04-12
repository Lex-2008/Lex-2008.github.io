title=Patch for avfs to show "magic" dirs
intro=Suggestion to improve its usability
tags=linux
created=2020-03-21

[AVFS][] is a FUSE filesystem which lets you look into archives without extracting them.
However, it doesn't show them - you're expected to add the magic `#` symbol to filename in order to use avfs features:

	[lex@flower2 test]$ ls -lah
	total 4.7M
	drwxr-xr-x 1 lex lex 4.0K Mar 22 13:58 .
	drwx------ 1 lex lex  72K Mar 22 13:58 ..
	-rw-rw-r-- 1 lex lex 2.3M Feb  3  2018 cfengine-3.10.3.tar.gz

	[lex@flower2 test]$ ls -lah cfengine-3.10.3.tar.gz#
	total 2.3M
	drwxr--r--  1 lex lex  2.3M Feb  3  2018 .
	drwxr-xr-x  1 lex lex  4.0K Mar 22 13:58 ..
	drwxr-xr-x 20 lex root    0 Feb  2  2018 cfengine-3.10.3

	[lex@flower2 test]$ ls -lah cfengine-3.10.3.tar.gz#/* | head
	total 3.7M
	drwxr-xr-x 20 lex root    0 Feb  2  2018 .
	drwxr--r--  1 lex lex  2.3M Feb  3  2018 ..
	-rwxr--r--  1 lex root  40K Feb  2  2018 aclocal.m4
	-rwxr--r--  1 lex root 6.3K Feb  2  2018 AUTHORS
	drwxr-xr-x  2 lex root    0 Feb  2  2018 cf-agent
	drwxr-xr-x  2 lex root    0 Feb  2  2018 cf-execd
	drwxr-xr-x  2 lex root    0 Feb  2  2018 cf-key
	drwxr-xr-x  2 lex root    0 Feb  2  2018 cf-monitord
	drwxr-xr-x  2 lex root    0 Feb  2  2018 cf-promises

This patch makes avfs show the otherwise-invisible "magic" directory in this case:

	[lex@flower2 test]$ ls -lah
	total 4.7M
	drwxr-xr-x 1 lex lex 4.0K Mar 22 13:58 .
	drwx------ 1 lex lex  72K Mar 22 13:58 ..
	-rw-rw-r-- 1 lex lex 2.3M Feb  3  2018 cfengine-3.10.3.tar.gz
	drwxr--r-- 1 lex lex 2.3M Feb  3  2018 cfengine-3.10.3.tar.gz#

Note that it does so by only inspecting file extension, and not the file format itself.
Moreover, avfs supports specifying which archiver to use - so if you have a tarball renamed to `*.bak`, you can still access it by specifying `#utar`, like this:

	[lex@flower2 test]$ mv cfengine-3.10.3.tar.gz{,.bak}

	[lex@flower2 test]$ ls -lah cfengine-3.10.3.tar.gz.bak#ugz#utar
	total 4.0K
	drwxr-xr-x  3 lex lex     0 Feb  2  2018 .
	drwxr-xr-x  1 lex lex  4.0K Mar 22 14:41 ..
	drwxr-xr-x 20 lex root    0 Feb  2  2018 cfengine-3.10.3

This case is not supported by this patch (i.e. you won't see this directory with `ls`, but you still can `cd` into it and `ls` its content, like shown above).

To build avfs with this patch, first clone the official AVFS repo with git:

	git clone https://git.code.sf.net/p/avf/git avf-git

And then follow the [official build instructions for AVFS][build], but just before `make` step run the following:

	wget http://alexey.shpakovsky.ru/en/avfs-dirs.patch
	git apply avfs-dirs.patch

Then [mount avfs as usual][test] and enjoy!

[AVFS]: http://avf.sourceforge.net/
[build]: https://sourceforge.net/p/avf/git/ci/master/tree/doc/README.avfs-fuse#l11
[test]: https://sourceforge.net/p/avf/git/ci/master/tree/doc/README.avfs-fuse#l60
