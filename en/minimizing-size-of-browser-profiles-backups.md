title=Minimizing size of browser profiles backups
uuid=723bb394-7142-4518-9ec3-5add18295b2e
PROCESSOR=Markdown.pl
intro=how to minimize them about 10-fold
tags=bash chromium firefox windows
style=
styles=
created=2022-08-06

If you, like me, care about your resilience of your browser session
(history, bookmarks, open tabs),
then you likely do backup it.
Maybe even every 5 minutes?

However, you might also notice that it takes up quite some space.
For example, my Google Chrome "User Data/Default" directory takes up just a bit over a gigabyte.
That's quite a lot to backup every 5 minutes!
But most of this data is not interesting: some caches, extensions which can be reinstalled if needed, and other "site data" which I don't care about.
Actually, most of _directories_ can be safely ignored
(just disable "recursive" option in your backup utility),
what leaves "only" a bit over 150 Mb.
The only subdirectory I actually care about is "Sessions" -
that's where list of all open tabs is saved -
and it can be dealt with by a separate job in the backup utility.

Is it possible to go below 150Mb?
Yes, and that's what this article is about!
Turns out, many of these files are actually SQLite3 databases, which:

a) seem to _only_ grow in size (if you don't `VACUUM` them)

b) aren't compressed (well, SQLite does support some compression extensions:
one of them is developed by SQLite devs and is [paid][zipfs],
and another one was recently [shown][sqlite-zstd] on Hacker News,
but could you convince your browser vendor to use any of them?)

[zipfs]: https://www.sqlite.org/zipvfs/doc/trunk/www/index.wiki
[sqlite-zstd]: https://news.ycombinator.com/item?id=32303762

c) are optimized for performance (hi indexes), so have some duplicate data.

After manually trying various approaches to compress some of the biggest databases in profile,
(including running `VACUUM` on a database followed by `gzip`'ing it),
I concluded that the most simple and space-efficient way is
to **dump** database to a plaintext SQL file,
and then gzip-compress the resulting text,
something like this:

	sqlite3 "$file" .dump | gzip >"$file.sql.gz"

This needs to be done only with SQLite databases,
and care should be taken with exclusively locked files which can't be open for reading
(if your OS supports that).
For example, on Windows I use [FreeFileSync][ffs]
to sync browser profiles into `C:\browser-backups\%BrowserName%.tmp` folders,
and then the following Cygwin script to move-compress them to `C:\browser-backups\%BrowserName%`,
from where they're picked up by `rsync` from the backup server.

	#!/bin/bash
	PATH=/usr/local/bin:/usr/bin:/bin
	cd /cygdrive/c/browser-backups/
	for browser in Chrome Vivaldi Firefox; do
		mkdir $browser.wip
		ls $browser.tmp | while IFS= read -r file; do
			if ! head -c15 "$browser.tmp/$file" | fgrep -q "SQLite format 3"; then
				# plain file
				ln "$browser.tmp/$file" $browser.wip
			else
				# sqlite db
				sqlite3 "$browser.tmp/$file" .dump | gzip >"$browser.wip/$file.sql.gz"
				touch -r "$browser.tmp/$file" "$browser.wip/$file.sql.gz"
			fi
		done
		test -d $browser/Sessions && mv $browser/Sessions $browser.wip
		mv $browser $browser.del
		mv $browser.wip $browser
		rm -rf $browser.del
	done

Note that it also preserves `C:\browser-backups\%BrowserName%\Sessions` directories for Chrome-based browsers,
assuming they're copied separately.

[ffs]: https://freefilesync.org/manual.php?topic=volume-shadow-copy

After that, size of overall data to backup decreased from over 150 Mb to 18Mb,
and the biggest file
(which is also the one which gets changed most often) -
from 64 to 6.6Mb.

While these megabytes might sound not that much,
worth noting that being backed up every 5 minutes,
these backups of browser profiles contribute to a noticeable share of my backup server disk usage.

Of course, alternative would be to use an advanced filesystem,
like ZFS or btrfs,
which natively supports per-block deduplication
(so they can store common parts only once).
But if your backup server is a small router
(or even an entry-level NAS)
without support for these fancy filesystems,
and you can't recompile kernel for it -
what other options do you have?
