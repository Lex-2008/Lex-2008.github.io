title=busybox httpd file upload
PROCESSOR=Markdown.pl
intro=busybox has a nice http webserver module, even with cgi support - and you can use it to upload files, too
tags=bash net linux
created=2020-01-06

`busybox httpd -vvfp 8000` is a very handy command when you need to quickly spin up a web server to share some files.
Another option is `python -m SimpleHTTPServer 8000`.

But what if you need to share some file, and you don't have shell access to it (like, someone's phone)?
Then you can just use these two files to quickly upload it to your Linux machine!

post_upload.htm
---------------

	<html>
	<body>
	<form action=/cgi-bin/post_upload.cgi method=post enctype=multipart/form-data>
	File to upload: <input type=file name=file1> <input type=submit>
	</form>


post_upload.cgi
---------------

put this file into the `cgi-bin` dir.

	#!/bin/sh

	# POST upload format:
	# -----------------------------29995809218093749221856446032^M
	# Content-Disposition: form-data; name="file1"; filename="..."^M
	# Content-Type: application/octet-stream^M
	# ^M    <--------- headers end with empty line
	# file contents
	# file contents
	# file contents
	# ^M    <--------- extra empty line
	# -----------------------------29995809218093749221856446032--^M

	file=/tmp/$$-$RANDOM

	CR=`printf '\r'`

	# CGI output must start with at least empty line (or headers)
	printf '\r\n'

	IFS="$CR"
	read -r delim_line
	IFS=""

	while read -r line; do
	    test x"$line" = x"" && break
	    test x"$line" = x"$CR" && break
	done

	cat >"$file"

	# We need to delete the tail of "\r\ndelim_line--\r\n"
	tail_len=$((${#delim_line} + 6))

	# Get and check file size
	filesize=`stat -c"%s" "$file"`
	test "$filesize" -lt "$tail_len" && exit 1

	# Check that tail is correct
	dd if="$file" skip=$((filesize - tail_len)) bs=1 count=1000 >"$file.tail" 2>/dev/null
	printf "\r\n%s--\r\n" "$delim_line" >"$file.tail.expected"
	if ! diff -q "$file.tail" "$file.tail.expected" >/dev/null; then
	    printf "<html>\n<body>\nMalformed file upload"
	    exit 1
	fi
	rm "$file.tail"
	rm "$file.tail.expected"

	# Truncate the file
	dd of="$file" seek=$((filesize - tail_len)) bs=1 count=0 >/dev/null 2>/dev/null

	printf "<html>\n<body>\nFile upload has been accepted"

Uploaded files will appear in `/tmp/` directory with random numbers.
This can be changed, ofc.

from [busybox repo][r].

[r]: https://github.com/mhfan/busybox/blob/master/networking/httpd_post_upload.txt

<script src="/microlight.js"></script>
