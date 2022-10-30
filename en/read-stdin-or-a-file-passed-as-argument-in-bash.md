title=Read stdin <b>OR</b> a file passed as argument in bash
intro=<b>TL;DR:</b> <code>cat "${1:-/dev/stdin}"</code>
tags=bash
style=
styles=
created=2022-10-27
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Many *nix utilities
(`cat`, `grep`, `head`, `tail`, `sed`,...)
have a nice feature:
they can either process stdin, or a file passed as argument.
For example:

	# first lines of a file
	head file.txt
	# first lines of a command's output
	ls | head

Turns out, it's pretty easy to add the same feature to your bash script(s)!

Just assign filename to a variable,
with `/dev/stdin` as default value.

For example:

	#!/usr/bin/env bash

	# unlc - print number of unique lines in the optional input file or stdin
	#
	# Usage:
	#
	#   unlc [input-file]

	input_file="${1:-/dev/stdin}"

	cat "$input_file" | sort | uniq | wc -l

Naturally, you're not limited by using only the _first_ argument,
you can combine it with argument processing tricks,
but this _is left as excersise for the reader_ ;-)

Source: [How to make Bash scripts read from stdin][s1] by Paolo Amoroso,
originally taken from [this StackExchange][s2] answer by user Daniel.

[s1]: https://journal.paoloamoroso.com/how-to-make-bash-scripts-read-from-stdin
[s2]: https://superuser.com/questions/747884/how-to-write-a-script-that-accepts-input-from-a-file-or-from-stdin/807874#807874
