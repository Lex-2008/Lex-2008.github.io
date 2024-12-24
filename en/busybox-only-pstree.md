title=Busybox-only pstree
uuid=7d668355-2282-4933-88d3-5c38e71c0cd7
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
intro=For when you're on limited environment but want to see a process tree
tags=bash
created=2020-01-31

Just use this script:

	#!/bin/busybox ash
	#
	# Script to show process tree.
	# Accepts one optional argument:
	# pid of root process - by default 1 (init)

	cd /tmp

	# Preserve ps output to show
	ps w >ps.ps
	# Build list of 'parent child' pids
	grep 'PPid:' /proc/*/status | sed -r 's_/proc/([^/]*)/[^0-9]*([0-9]*)_\2 \1_' >ppids.ps

	# # on platforms that have more advanced `ps`
	# # and lack human-readable /proc/$$/status,
	# # you can use these commands, instead
	# ps -e -o pid,ppid,stime,args >ps.ps
	# awk '{ print $2 " " $1 }' ps.ps >ppids.ps

	# own pid - we don't show own children because they're guaranteed
	# to change between above two calls
	self=$$

	# function to show one process with all children, recursively
	# args:
	# * pid of process to show
	# * indent - string of spaces to print before current line
	showproc()
	{
		# print current process
		echo "$2$(grep "^ *$1 " ps.ps || echo "$1 ???")"
		# don't print own children
		test $1 == $self && return
		# print children, adding two spaces to indent
		for subpid in `grep "^ *$1 " ppids.ps | awk '{print $2}'`; do
			showproc $subpid "  $2"
		done
	}

	# start with root process (pid 1 by default)
	showproc ${1:-1} ''


<script src="/microlight.js"></script>
