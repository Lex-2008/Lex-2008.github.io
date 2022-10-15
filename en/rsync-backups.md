title=Rsync backups
PROCESSOR=Markdown.pl
intro=How I organized backups of my files
tags=bash
styles=archive
created=2016-04-03


**Update**: since January 2019, I've moved to a new backup system,
which is hosted on [GitHub][new].
I believe it's better for numerous reasons,
so please use that!

[new]: https://github.com/Lex-2008/backup3

* * *

Introduction
------------

Until recently I was [using tar][old] to backup my files.
It was working good, especially for syncing backups remotely,
since at the end I got only 2~3 new files,
which could be easily copied to remote destinations.
But this method had few caveats:

* Restoring individual files was a pain -
to do it, I should've find out in which archive is its last version
(i.e. recall when it was last modified),
and then give tar a cryptic command to extract individual file.
Not very nice: I had a "base" archive with exact snapshot of my system
as it was 2 months ago,
but I didn't have a snapshot of my system as it was, say, yesterday.

* Also, disk space management was a problem:
since archives were incremental, to maintain recoverability
I had to keep all files and couldn't delete anything to free space.
Moreover, since backups were made on one machine,
and then copied to others remotely,
there was no way for script to know
when it needs to think about space.
Moreover, since simple copy utilities don't check space before copying,
sometimes copy operation just filled up all available space
with temporary file(s), and failed after that,
thus leaving machine in partially unusable state with no disk space
(luckily, I could SSH into the box and remove excessive files).

So recently I stumbled upon a different idea:
to use `rsync`'s `--link-dest` commandline parameter
to keep folders with different versions of files
(snapshots of all backed up files).

Using hardlinks to keep same file in different folders helps
reduce used space while keeping exact snapshots -
to see on a file "how it was yesterday" I just need to look in
yesterday's folder!

Also, last folder will always have the most recent backup,
one folder before last will have snapshot just before that,
and by deleting oldest folders I can automatically gain free space as needed.

Good introduction to using `rsync --link-dest` for backups
is available [here][a] [(archived version)](http://archive.is/J4nnI#12%),
and more advanced version (which detects folder renames) - [here][b]
[(archived)](http://archive.is/9bJKQ),
with a result script available [here][c] on github.

[old]: incremental-backups.html
[a]: http://www.mikerubel.org/computers/rsync_snapshots/#Rsync
[b]: https://lincolnloop.com/blog/detecting-file-moves-renames-rsync/
[c]: https://github.com/dparoli/hrsync/blob/master/hrsync

Basic script
------------

So here is the most basic version:

	#!/bin/bash
	
	#remember: no slashes at the end of $DST!
	SRC="/home /etc"
	DST=/backup-local
	TODAY="$DST/$(date +%Y-%m-%d_%H-%M-%S)"
	
	LAST="$(ls -d $DST/*/ 2>/dev/null | tail -n 1)"
	test -z "$LAST" && LAST="$(mktemp -d)"
	
	#Main sync operation
	rsync -a --hard-links --no-inc-recursive --human-readable --stats --verbose --link-dest="$LAST" $SRC "$TODAY"

It has four options:

* Where to copy from and to.
Note that you can select several folders as source.

* Format for folder name (`TODAY`).
Currently it's something like `2015-12-31_23-59-59`.

* Folder with last backup (`LAST`).
It's found automatically and a temporary empty folder is created
for the first run to avoid issues.

And then it runs rsync.

Pretty easy, huh?

Note that I *didn't* put `$SRC` in quotes because I really want it to be
expanded to two arguments if it has space (say, `"/home /etc"`), and I *did* quote `"$DST"` because I want it to be one argument even if it has spaces.

Check if there is something to do
---------------------------------

Let's avoid creating folders if no files were changed.

To do it, we first run rsync in `--dry-run` mode,
and check if it transfers any files.

Also, let's move most-used rsync commands to a separate variable.
Relevant part of script looks like this now:

	DRY_RUN_OUTPUT="/tmp/dry-run"
	RSYNC="rsync -a --hard-links --no-inc-recursive"
	
	#Check if there is something to do
	$RSYNC --dry-run --stats $SRC $LAST >$DRY_RUN_OUTPUT
	grep -q 'Number of regular files transferred: 0' $DRY_RUN_OUTPUT && exit 0
	
	#Main sync operation
	$RSYNC --human-readable --stats --verbose --link-dest="$LAST" $SRC "$TODAY"


Excluding files
---------------

Probably you want to exclude some files from backup
(say, private SSH keys, cache, trash, etc).
To do this, just create an exclude file with content like this:

	*backup*
	*cache*
	*Cache*
	home/*/.local/share/Trash*
	home/*/.ssh/id_rsa

and reference it in the `RSYNC` variable like this:

	RSYNC="rsync -a --hard-links --no-inc-recursive --exclude-from=/backup-local/.exclude"

Error checking
--------------

Checking for errors is good.

Instead of writing directly to `$TODAY` folder,
let's create a temporary `$TODAY.wip` folder,
and rename it to `$TODAY` only if main rsync run finished successfully.

We also need `LAST` variable to ignore such `wip` folders:

	LAST="$(ls -d $DST/*/ 2>/dev/null | grep -v wip | tail -n 1)"

Main RSYNC command will look like this, then:

	$RSYNC --human-readable --stats --verbose --link-dest="$LAST" $SRC "$TODAY.wip"
	STATUS=$?
	if test $STATUS -ne 0; then
		   echo something went wrong
		   exit $STATUS
	fi
	mv "$TODAY.wip" "$TODAY"


Checking disk space
-------------------

Let's limit the script so it always tried to keep at least
10% free disk space (both in bytes and inodes)
Also, while cleaning up, it will leave at least two last snapshots
(If the disk doesn't have enough free space even with only two last folders
- it will stop).
Let's add this variables to the config section of our script:

	EXTRA_PERCENT=10
	KEEP_DIRS=2

And this block before main rsync operation:

	TRANSFER_SIZE=$(sed '/Total transferred file size/!d;s/[^0-9]//g' $DRY_RUN_OUTPUT)
	TOTAL_SPACE=$(df -B1 --output=size $DST | sed '1d')
	let EXTRA_FREE_SPACE=TOTAL_SPACE*EXTRA_PERCENT/100
	let FREE_SPACE_NEEDED=TRANSFER_SIZE+EXTRA_FREE_SPACE
	
	CREATED_DIRS=$(sed '/Number of files/!d;s/.* dir: \([^ ]*\).*/\1/;s/[^0-9]//g' $DRY_RUN_OUTPUT)
	CREATED_FILES=$(sed '/Number of regular files transferred/!d;s/[^0-9]//g' $DRY_RUN_OUTPUT)
	TOTAL_INODES=$(df -B1 --output=itotal $DST | sed '1d')
	let EXTRA_INODES=TOTAL_INODES*EXTRA_PERCENT/100
	let INODES_NEEDED=CREATED_DIRS+CREATED_FILES+EXTRA_INODES
	
	function check_space {
		FREE_SPACE_AVAILABLE=$(df -B1 --output=avail $DST | sed '1d')
		INODES_AVAILABLE=$(df --output=iavail $DST | sed '1d')
		[ $FREE_SPACE_AVAILABLE -lt $FREE_SPACE_NEEDED -o $INODES_AVAILABLE -lt $INODES_NEEDED ]
		# return status of 1 means "need to clear space"
	}
	
	function check_dirs {
		HISTORY_DIRS=$(ls -d $DST/‌*/ | wc -l)
		[ $HISTORY_DIRS -gt $KEEP_DIRS ]
		# return status of 1 means we can delete one
	}
	
	while check_space; do
		if check_dirs; then
			OLDEST=$(ls $DST/ | head -n 1)
			rm -rf $DST/$OLDEST
		else
			echo "can't clean up"
			exit 1
		fi
	done


Waiting for other copy of same script to finish
-----------------------------------------------

If you're running this script from a cron job,
you might want to avoid situations when
a new backup job starts while the previous one didn't finish.

Checking for `.wip` extension in last folder name is not good
- it might be there both while job is still in progress
and if it finished with error.
Looking at log file is not an option for the same reason.

We should use file locks:

	FLOCK_FILE="$DST/.lock"
	
	exec 200>"$FLOCK_FILE"
	flock -n 200 || exit 200


Limiting script running time
----------------------------

Above is good, but if a script gets "stuck" - then no more backups will be
running.  That's not good.  To fix this, we'll run a small function in parallel
to our main script, which will kill it after, say, 30 minutes.

	TIMEOUT=30m

	function timeout_monitor() {
		sleep "$1" &
		pid="$!"
		trap "kill $pid; exit" SIGTERM
		wait "$pid"
		echo "Had to kill due to timeout. Please cleanup process group $2. Bye"
		kill "$2"
	}
	timeout_monitor "$TIMEOUT" "$$" &
	TIMEOUT_MONITOR_PID=$!
	trap "kill $TIMEOUT_MONITOR_PID" EXIT

This function greatly inspired by [this](http://stackoverflow.com/a/28930451)
answer on stackoverflow.

Note, however, that we use `trap` instead of putting `kill` command at the end
of the script (last line in the code above), because there are many "exit
points" in our script.

Also note that we kill `sleep` process inside `timeout_monitor` function (also
with trap) to clean it up, too.  During normal execution main script will
finish much faster than `timeout_monitor`, so it's better to clean up.  If
something goes wrong - it's more acceptable to leave hanging processes (note
the echo command).  We could consider killing the whole process group, but it
usually means that `kill` might kill itself, and I haven't found a way to change
process group from bash script itself.


First run
---------

Running the script for the first time (if destination directory is empty) is a
rare case, so in order to avoid running the script with an empty directory by
mistake let's add an option which would forbid it by default.  Also, during
first run we should ignore timeout (since first backup usually takes a lot of
time, and it's normal) and delete the temporary empty folder at the end of the
script.

So we replace `test -z "$LAST" && LAST="$(mktemp -d)"` line with this code:

	ALLOW_FIRST_RUN=0
	
	LAST="$(ls -d "$DST"/*/ 2>/dev/null
	if [ -z "$LAST" ]; then
		if [ "$ALLOW_FIRST_RUN" -eq 1 ]; then
			LAST="$(mktemp -d)"
			kill "$TIMEOUT_MONITOR_PID"
			trap "rmdir $LAST" EXIT
		else
			echo "First run not allowed, but [$DST] is empty. bye"
			exit 3;
		fi
	fi

Note that here `trap ... EXIT` command will overwrite previously defined one.


Redirect output
---------------

If you're running this script from a cron job,
you might want to redirect all output (both stdout and stderr) to a file,
and "important" messages (from your script) - to stdout
(so cron would send you an email if something goes wrong).

But when running the script interactively,
you might want to see *all* output at your screen.

To do this, add this somewhere at the top
(before first `echo` command):

	# redirect output to a file if running non-interactively
	if test -t 1; then
		exec 3>&1 &> >(tee "$TODAY.log")
	else
		exec 5>&1
		exec 1>"$TODAY.log" 2>&1 3> >(sed "1s|^|$DST:\n|" >&5)

	fi

and then, all "error" messages can be redirected to stream 3
in order to be emailed when the script is run via cron.

sed also adds a header - this is useful if one cron task is used to run several
backup tasks.


Listing all changes
-------------------

Running rsync with `--verbose` parameter shows us copied (added or modified)
files, but not deleted. To have a better analysis of changes in your log file,
add this command at the very end of the script:

	$RSYNC --dry-run --itemize-changes "$TODAY/" "$LAST"

Check if there is something to do - different way
-------------------------------------------------

In some cases (when destination is on a slow and noisy disk, for example),
we would rather avoid touching it when there is nothing to do.
So instead of running rsync in `--dry-run` mode, we can run it in "list" mode,
when it lists all the files and their properties
and compare this run with the previous one:

	if test ! -z "$FILE_LIST"; then
		$RSYNC $SRC >"$FILE_LIST.new"
		diff -q "$FILE_LIST" "$FILE_LIST.new" &>/dev/null && exit 0
		mv "$FILE_LIST.new" "$FILE_LIST"
	fi

Note that we will still need to run `rsync --dry-run` to estimate size of transfer
(and amount of disk space needed).

This is pure optional step - it removes one rsync operation from the target device
at the cost of extra rsync operation on the source.
You chose what's better!


Cleaning up in multiple folders
-------------------------------

If you run this script every hour (or even every ten minutes),
they you soon will start deleting some (older) backups,
and might want to keep daily, weekly, and monthly versions by simple command:

	cp -al $LAST "/backup-daily/$(date +%Y-%m-%d)"

Or maybe you backup from several remote machines to one "backup server".

Anyway, you might end up in a situation when you want to clean from several
directories, not only where you copy to.

Most probably, you want to keep _same amount_ of snapshots in all of them.

To do this, add these options on the top of the script:

	ALLOW_DELETE=1
	CLEAN_DIRS="/backup/*"
	PRESERVE_DIRS_LIST="$DST/.preserve"
	DELETE_DIRS_LIST="$DST/.delete"
	TO_SORT_LIST="$DST/.to_sort"

and replace the simple `while check_space; do` loop from above with this behemoth:

	while check_space; do
		echo need to clean up
		if [ "$ALLOW_DELETE" -eq 0 ]; then
			echo 'Need to clean up, but deleting files forbidden. Clean up manually, bye'>&3
			exit 11
		fi
		# find a dir to delete
		for i in $CLEAN_DIRS; do
			ls -d "$i"/*/ | fgrep -v wip | tail -n $KEEP_DIRS >$PRESERVE_DIRS_LIST
			ls -d "$i"/*/ | fgrep -v -f $PRESERVE_DIRS_LIST >$DELETE_DIRS_LIST
			test -s $DELETE_DIRS_LIST || continue # print nothing if there's nothing to delete
			echo -n "$(wc -l <$DELETE_DIRS_LIST) " # note space at the end
			cat $DELETE_DIRS_LIST | head -n 1
		done >$TO_SORT_LIST
		OLDEST_FILE="$(cat $TO_SORT_LIST | sort -n | tail -n 1 | sed 's/^[0-9]* *//')"
		if test -z "$OLDEST_FILE"; then
			echo 'Deleted all i could, but still not enough space. Buy more disks, bye'>&3
			exit 12
		fi
		# some logging before actual deleting
		echo rm -rf "$OLDEST_FILE"
		echo === $TODAY >>$DELETE_LOG
		cat $TO_SORT_LIST | sort -n >>$DELETE_LOG
		echo rm -rf "$OLDEST_FILE" >>$DELETE_LOG
		rm -rf "$OLDEST_FILE"
		if test -d "$OLDEST_FILE"; then
			echo "Could not delete [$OLDEST_FILE]. Check permissions, bye">&3
			exit 13
		fi
	done

Note that this also adds a variable `$ALLOW_DELETE` which can be set to 0 to
forbid deletions. This might be useful if you know that destination should not
run out of space - in this case deletion would be considered an error.

Also, it doesn't delete *.log files which are usually kept in same directory -
you can delete them periodically by running this script:

	for f in /backup/*/*.log; do
		[ -d "${f%.log}" ] || rm "$f"
	done

It will delete all *.log files, for which relevant directory does not exist.

Maybe it's not the most elegant way, but deleting log files in the same loop as
directories might delete the log file we're writing to itself!

Also it checks that the directory was indeed deleted - otherwise, you might end
up in an infinite loop - nasty stuff, happened to me once.


Cygwin considerations
---------------------

If you happen to have Windows, you most probably want to install cygwin on it,
in order to use SSH, rsync, and other good things.

But when using Windows systems, you should be aware of some limitations:

* NTFS has different permissions model, so you probably don't want to copy
  file permission, owner, and group information:

		test "$NTFS_DST" -eq 1 && RSYNC="$RSYNC --no-perms --no-owner --no-group"

* Under Cygwin, `df` doesn't report inodes, so you have to skip relevant checks.

This will be shown in the big script below.

Resulting script (big)
----------------------

With some debug output added.

	#!/bin/bash

	test -z "$1" || SRC="$1"
	test -z "$2" || DST="$2"

	test -z "$SRC" && { echo 'SRC not defined'; exit 1; }
	test -d "$DST" || { echo 'DST is not a dir'; exit 2; }
	DST="${DST%/}" # remove trailing slash

	test -z "$ALLOW_FIRST_RUN" && ALLOW_FIRST_RUN=0

	test -z "$ALLOW_DELETE" && ALLOW_DELETE=1
	test -z "$EXTRA_PERCENT" && EXTRA_PERCENT=10
	test -z "$CLEAN_DIRS" && CLEAN_DIRS="$DST"
	test -z "$KEEP_DIRS" && KEEP_DIRS=10

	test -z "$NTFS_DST" && NTFS_DST=0
	test -z "$IGNORE_23" && IGNORE_23=0

	test -z "$TIMEOUT" && TIMEOUT=30m
	test -z "$TIMEOUT_SMALL" && TIMEOUT_SMALL=10m

	FLOCK_FILE="$DST/.lock"
	#FILE_LIST=
	DRY_RUN_OUTPUT="$DST/.dry-run"
	PRESERVE_DIRS_LIST="$DST/.preserve"
	DELETE_DIRS_LIST="$DST/.delete"
	TO_SORT_LIST="$DST/.to_sort"
	DELETE_LOG=/var/log/backup-delete.log

	test -z "$DATE_FORMAT" && DATE_FORMAT="%F_%T"
	test -z "$TODAY" && TODAY="$DST/$(date "+$DATE_FORMAT")"
	test -z "$RSYNC" && RSYNC="rsync -a --no-inc-recursive --hard-links --fake-super"

	# http://stackoverflow.com/a/28930451
	function timeout_monitor() {
		sleep "$1" &
		pid="$!"
		trap "kill $pid; exit" SIGTERM
		wait "$pid"
		echo "Had to kill due to timeout. Please cleanup process group $2. Bye"
		kill "$2"
	}
	timeout_monitor "$TIMEOUT" "$$" &
	TIMEOUT_MONITOR_PID=$!
	trap "kill $TIMEOUT_MONITOR_PID" EXIT

	test "$NTFS_DST" -eq 1 && RSYNC="$RSYNC --no-perms --no-owner --no-group"

	function NOT_CYGWIN() {
		test "$(uname -o)" != "Cygwin"
	}

	IS_FIRST_RUN=0
	LAST="$(ls -d "$DST"/*/ 2>/dev/null | grep -v wip | tail -n 1)"
	if [ -z "$LAST" ]; then
		if [ "$ALLOW_FIRST_RUN" -eq 1 ]; then
			LAST="$(mktemp -d)"
			kill "$TIMEOUT_MONITOR_PID"
			trap "rmdir $LAST" EXIT
		else
			echo "First run not allowed, but [$DST] is empty. bye"
			exit 3;
		fi
	fi

	# check that no other copy of this script is running
	exec 200>"$FLOCK_FILE"
	flock -n 200 || exit 200


	# check if there was any change in the source
	# this is useful when we don't want to touch $DST
	# (for example, when it's on slow HDD)
	if test ! -z "$FILE_LIST"; then
		timeout "$TIMEOUT_SMALL" $RSYNC "$SRC" >"$FILE_LIST.new"
		diff -q "$FILE_LIST" "$FILE_LIST.new" &>/dev/null && exit 0
		mv "$FILE_LIST.new" "$FILE_LIST"
	fi

	# check if there is something to do
	# Note that it's still needed even if we have a check above,
	# because there are commands below that are using $DRY_RUN_OUTPUT
	timeout "$TIMEOUT_SMALL" $RSYNC --dry-run --stats "$SRC" "$LAST" >$DRY_RUN_OUTPUT
	grep -q 'Number of regular files transferred: 0' $DRY_RUN_OUTPUT && exit 0

	# redirect output to a file if running non-interactively
	if test -t 1; then
		exec 1> >(tee "$TODAY.log") 2>&1 3>&1
	else
		exec 5>&1 # save original stdout, which gets emailed by cron
		#exec 1>"$TODAY.log" 2>&1 3> >(tee >(sed "1s|^|$DST:\n|" >&5))
		exec 1>"$TODAY.log" 2>&1 3> >(sed "1s|^|$DST:\n|" >&5)
	fi

	# start logging
	echo "started $TODAY"

	# TODO: check that target device has enough space at all

	echo INFO: check disk space
	TRANSFER_SIZE=$(sed '/Total transferred file size/!d;s/[^0-9]//g' $DRY_RUN_OUTPUT)
	TOTAL_SPACE=$(df -B1 --output=size "$DST" | sed '1d')
	let EXTRA_FREE_SPACE=TOTAL_SPACE*EXTRA_PERCENT/100
	let FREE_SPACE_NEEDED=TRANSFER_SIZE+EXTRA_FREE_SPACE

	echo $TRANSFER_SIZE bytes in new files
	echo $EXTRA_FREE_SPACE extra free bytes
	echo $FREE_SPACE_NEEDED total space needed

	if NOT_CYGWIN; then # no inode info on Cygwin, sorry
		CREATED_DIRS=$(sed '/Number of files/!d;s/.* dir: \([^ ]*\).*/\1/;s/[^0-9]//g' $DRY_RUN_OUTPUT)
		CREATED_FILES=$(sed '/Number of regular files transferred/!d;s/[^0-9]//g' $DRY_RUN_OUTPUT)
		TOTAL_INODES=$(df -B1 --output=itotal "$DST" | sed '1d')
		let EXTRA_INODES=TOTAL_INODES*EXTRA_PERCENT/100
		let INODES_NEEDED=CREATED_DIRS+CREATED_FILES+EXTRA_INODES

		echo $CREATED_DIRS dirs created
		echo $CREATED_FILES files created
		echo $EXTRA_INODES extra inodes
		echo $INODES_NEEDED total inodes needed
	fi

	# return status of 1 means "need to clear space"
	function check_space {
		FREE_SPACE_AVAILABLE=$(df -B1 --output=avail "$DST" | sed '1d')
		INODES_AVAILABLE=$(df --output=iavail "$DST" | sed '1d')
		echo $FREE_SPACE_AVAILABLE space available
		echo $INODES_AVAILABLE inodes available
		if NOT_CYGWIN; then
			test $FREE_SPACE_AVAILABLE -lt $FREE_SPACE_NEEDED -o $INODES_AVAILABLE -lt $INODES_NEEDED
			return $?
		else
			test $FREE_SPACE_AVAILABLE -lt $FREE_SPACE_NEEDED
			return $?
		fi
	}

	while check_space; do
		echo need to clean up
		if [ "$ALLOW_DELETE" -eq 0 ]; then
			echo 'Need to clean up, but deleting files forbidden. Clean up manually, bye'>&3
			exit 11
		fi
		# find a dir to delete
		for i in $CLEAN_DIRS; do
			ls -d "$i"/*/ | fgrep -v wip | tail -n $KEEP_DIRS >$PRESERVE_DIRS_LIST
			ls -d "$i"/*/ | fgrep -v -f $PRESERVE_DIRS_LIST >$DELETE_DIRS_LIST
			test -s $DELETE_DIRS_LIST || continue # print nothing if there's nothing to delete
			echo -n "$(wc -l <$DELETE_DIRS_LIST) " # note space at the end
			cat $DELETE_DIRS_LIST | head -n 1
		done >$TO_SORT_LIST
		OLDEST_FILE="$(cat $TO_SORT_LIST | sort -n | tail -n 1 | sed 's/^[0-9]* *//')"
		if test -z "$OLDEST_FILE"; then
			echo 'Deleted all i could, but still not enough space. Buy more disks, bye'>&3
			exit 12
		fi
		# some logging before actual deleting
		echo rm -rf "$OLDEST_FILE"
		echo === $TODAY >>$DELETE_LOG
		cat $TO_SORT_LIST | sort -n >>$DELETE_LOG
		echo rm -rf "$OLDEST_FILE" >>$DELETE_LOG
		rm -rf "$OLDEST_FILE"
		if test -d "$OLDEST_FILE"; then
			echo "Could not delete [$OLDEST_FILE]. Check permissions, bye">&3
			exit 13
		fi
	done

	echo INFO: main sync operation
	$RSYNC --human-readable --stats --link-dest="$LAST" "$SRC" "$TODAY.wip"

	STATUS=$?
	echo INFO: exit if somethig is wrong
	if test ! \( $STATUS -eq 0 -o \( $STATUS -eq 23 -a $IGNORE_23 -eq 1 \) \); then
		echo "something went wrong. Please see log file for details. bye" >&3
		echo "$TODAY.log" >&3
		exit $STATUS
	fi

	sleep 5
	mv "$TODAY.wip" "$TODAY"

	echo INFO: list of changes
	# note: unlike "main sync operation" above, this will list deleted files, too
	timeout "$TIMEOUT_SMALL" $RSYNC --dry-run --itemize-changes "$TODAY/" "$LAST"

	echo "INFO: finish at $(date "+$DATE_FORMAT")"

This script is supposed to be universal and called by another scripts like this:

	/usr/local/bin/backup.sh /2backup/ /backup-local


Remote backups
--------------

Thanks to rsync magic, remote backups are as easy as local ones, with few considerations:

* the script should be run on the backup server
(due to local `df` and `rm -rf` commands).
Actually, it's also recommended to do it this way by some security experts
[citation needed].

* it's best if the backup machine won't have root access to the system it's backing up - to do it, one can [run rsync as a daemon][d] [(archived version)](http://archive.is/mVD91#84%).

* to encrypt files before transferring, we can use encfs in `--reverse` mode, but keep in mind to keep hold of your `.encfs*` file!

* if you're backing to multiple machines,
to avoid keeping the `--exclude-fr‌om` file in sync between all scripts,
we can use [rofs-filtered][f] to exclude files on the _source_ machine before rsync is run.
But keep in mind to add `-ouse_ino` at the end if you want to keep hardlinks ([ref][g] [(archived)](http://archive.is/vvvVk))

[d]: http://www.jveweb.net/en/archives/2011/01/running-rsync-as-a-daemon.html#jveweb_en_021_06
[f]: https://github.com/gburca/rofs-filtered
[g]: https://sourceforge.net/p/fuse/mailman/fuse-devel/thread/4A9BA4F7.9090207@amazon.com/


Alternative view
----------------

One might want to have an alternative view on the backup tree:

* some want to see all versions of each file in one folder

* others might want to see a "normal" tree of files, each file representing a "previous" version of backed-up file.

To get them, one could use this script (it creates symlinks, so no space considerations needed):

	LAST="$(ls -d $DST/*/ 2>/dev/null | grep -v wip | tail -n 1)"
	FILES_LIST="/tmp/interesting-files"
	
	rm -rf /backup-older
	rm -rf /backup-prev
	
	time find "$LAST" -type f -printf '%P\n' | sed 's/\([ \o47()"&;\\]\)/\\\1/g;s/\o15/\\r/g' | sed 's!\(.*\)!ls -U -i /backup-local/*/\1!' | sh | sed 's/ /$/g;s!\([0-9$]*\)$/backup-local/\([0-9_-]*\)\(.*\)/\([!/]*\)!\2 \1 \3 \4!' | uniq -f 1 | uniq -f 2 -D >"$FILES_LIST"
	
	#/backup-older
	cat "$FILES_LIST" | sed 's!\([^ ]*\) \([^ ]*\) \([^ ]*\) \(.*\)!mkdir -p "/backup-older\3/\4"; ln -s "/backup-local/\1\3/\4" "/backup-older\3/\4/\1-\4"!;s/\$/ /g' | sh
	
	#/backup-prev
	cat "$FILES_LIST" | tac | uniq -f 2 | sed 's!\([^ ]*\) \([^ ]*\) \([^ ]*\) \(.*\)!mkdir -p "/backup-prev\3"; ln -s "/backup-local/\1\3/\4" "/backup-prev\3/\4"!;s/\$/ /g' | sh


One might think about using `rsync --backup-dir` instead,
but it has a slight drawback of forever keeping deleted files.

History
-------

* This post started on December 8, 2015
as a collection of useful links.

* At February 5, 2016 I started implementing it as a local version,
together with "renamed folders" detection algorithm.

* The final shape of this script (with space checking) was finally implemented
at the end of March 2016.

* In the May 2016 few optional parts were added:
multiple folders, Cygwin, extra check.

* In October 2016, script timeout and more checks were added
(first run, allow\_delete, and if deletion succeeded).
Also, logs now show also deleted files
(via `rsync --itemize-changes` instead of `rsync --verbose`).

This post will be updated periodically.
To be informed on updates, please write me
(email address at the bottom of this page)
a short free-form message.

<div>
<script src="../microlight.js"></script>
<style>
.toc {
	position: fixed;
	top: 0px;
	right: 0px;
	width: calc((100% - 874px - 24px)/2);
}
.toc > h2 {font-size: 1em;}
.toc > a {
	display: block;
	 margin-bottom: 1ex;
}
</style>
<script>
function mktoc(){
	var toc="<div class='toc'>";
	var list=document.querySelectorAll('h2');
	for(var i=0;i<list.length;i++){
		list[i].id=list[i].innerText;
		toc+="<a href=\"#"+list[i].innerText+"\">"+list[i].innerText+"</a>";
	}
	toc+="</div>";
	document.body.innerHTML+=toc;
	}
setTimeout('mktoc()',100);
</script>
</div>
