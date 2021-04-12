title=Incremental backups
intro=How I organised backups of my machine
tags=bash
created=2014-06-17
modified=2016-09-26
modified_now=1


**Update**: since April 2016, I've moved to a new backup system,
based on [`rsync --link-dest`][new] parameter.
I believe it's better for numerous reasons,
so please use that!

* * *

Based on a [short note][] from my Russian blog, let's make a good backupping system.

[new]: rsync-backups.html
[short note]: /ru/incremental-backup-с-помощью-tar.html

Humble beginning
----------------

We can start from a simple one-liner:

	tar --create --gzip --ignore-failed-read --one-file-system --preserve-permissions --sparse --exclude=*cache* --exclude=*trash* --exclude=home/*/.ssh/‌* --ignore-case --listed-incremental=/backup/weekly --file=/backup/weekly-$(date +%G-%V).tar.gz /home /etc /usr/local/bin

It creates files with names like `weekly-2015-39.tar.gz` in the `/backup/` folder.
They are compressed (note `--gzip` argument),
each of them has only files changed since last archive creation (note `--listed-incremental=` argument),
and they have some other useful features - you can check the `man tar` page for other arguments.

You should run this command weekly.
Stick it to `/etc/cron.weekly/`, for example.

Recoverability
--------------

Let's start with adding some recovery information for the case of broken bits.
`par2create` is the tool to create a file with such recovery information
(you're encouraged to check how to recover them yourself - I won't tell you).

That's done by a simple command

	par2create -r10 -n1 {filename}

where `-r10` means "recover from the loss of up to 10% of original file",
and `-n1` means "create only one recovery file"

To make it play nicely, the script grows a bit:

	from="/home /etc /usr/local/bin"
	cd /backup # destination for archives
	file="weekly-$(date +%G-%V).tar.gz"
	tar --create --gzip --ignore-failed-read --one-file-system --preserve-permissions --sparse --exclude=*cache* --exclude=*trash* --exclude=home/*/.ssh/‌* --ignore-case --listed-incremental=weekly --file=$file $from
	par2create -r10 -n1 $file

In addition to files mentinoed above, it will also create files like `weekly-2015-39.tar.gz.par2` and `weekly-2015-39.tar.gz.vol000+200.par2` with some recovery information.

Space concerns
--------------

Ok, so incremental archives work like this:
first, tar creates a "base" archive, which contains *all* files
(and the `weekly` file with some metadata)
and then, every week it creates an incremental archive with files changed during this week
(and also updates the `weekly` file).

Eventually used space grows, and you might think that it's time to recreate the base archive and delete all incremental ones.

To do this, let's compare the sizes of "base" and all "incremental" archives,
and when sum of incremental gets bigger then the base - it's time to clean up.

So we will do something like this:

	let size_base=$(du -c base-*.tar.gz | grep total)
	let size_incr=$(du -c weekly-*.tar.gz | grep total)
	if [ $size_inc -gt $size_base ]; then
		# Clean up and create new base archive
	else
		# Create weekly archive as normal
	fi

Since we're creating archives in two different places -
it's time to move relevant lines to a separate function.

And the whole script will look like this
(note that I also added a command to create the "base" archive when there is no "weekly" file):


	from="/home /etc /usr/local/bin"
	cd /backup # destination for archives

	archive() {
		tar --create --gzip --ignore-failed-read --one-file-system --preserve-permissions --sparse --exclude=*cache* --exclude=*trash* --exclude=home/*/.ssh/‌* --ignore-case --listed-incremental=$1 --file=$2 $from
		par2create -r10 -n1 $2
	}

	week=$(date +%G-%V)

	if [ ! -f weekly ]; then
		# First run - create base archive
		archive weekly base-$week.tar.gz
	else
		# Check sizes
		let size_base=$(du -c base-*.tar.gz | grep total)
		let size_incr=$(du -c weekly-*.tar.gz | grep total)
		if [ $size_inc -gt $size_base ]; then
			# Clean up and create new base archive
			delete_list="$(ls weekly-* base-*)"
			rm weekly
			archive weekly base-$week.tar.gz
			rm $delete_list
		else
			# Create weekly archive
			archive weekly weekly-$week.tar.gz
		fi
	fi


Daily backups
-------------

Let's also add some daily backups.
But keeping in mind that some files might change every day,
instead of just renaming `weekly` to `daily`,
let's make them also incremental, but based on latest `weekly` file.

Like this:

	#!/bin/bash

	from="/home /etc /usr/local/bin"
	cd /backup # destination for archives

	archive() {
		tar --create --gzip --ignore-failed-read --one-file-system --preserve-permissions --sparse --exclude=*cache* --exclude=*trash* --exclude=home/*/.ssh/‌* --ignore-case --listed-incremental=$1 --file=$2 $from
		par2create -r10 -n1 $2
	}

	dow=$(date +%w)
	week=$(date +%G-%V)

	if [ ! -f weekly ]; then
		# First run - create base archive
		archive weekly base-$week.tar.gz
		cp weekly daily
	elif [ $dow == 0 ]; then
		# Sunday - check sizes
		let size_base=$(du -c base-*.tar.gz | grep total)
		let size_incr=$(du -c weekly-*.tar.gz | grep total)
		if [ $size_inc -gt $size_base ]; then
			# Clean up and create new base archive
			delete_list="$(ls weekly-* base-*)"
			rm weekly
			archive weekly base-$week.tar.gz
			rm $delete_list
		else
			# Create weekly archive
			archive weekly weekly-$week.tar.gz
		fi
		rm daily*
		cp weekly daily
	else
		# Create daily archive
		archive daily daily-$dow.tar.gz
	fi

At the end you can also add some command to `rsync` your backups to remote server.

In next article I'll cover more advanced topics, like:

* encryption

* multiple machines backups

* separating settings, code, and data

* ...and maybe something more

Stay tuned!

> Thanks to my Linux [friend][] for his valuable input on this subject

[friend]: http://ruario.ghost.io

<script src="/microlight.js"></script>
