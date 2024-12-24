title=Sorting sent email
uuid=35848f6d-1f3f-4b70-b23d-dffdd857c94a
PROCESSOR1=Markdown.pl
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
intro=How to automate it if you host your mail yourself
tags=e-mail
created=2014-11-01

**Update**:
In 2021, I switched to using [sieve][s] scripts to sort incoming and outgoing emails.

[s]: https://github.com/Lex-2008/containers/blob/master/dovecot.cont/data/conf/dovecot.conf#L35

There are numerous ways of sorting incoming mail into folders (personally I use procmail),
but not enough ways of sorting _sent_ mail.
SquirrelMail has [Per Recipient Sent Folders][] plugin, but that's sorting on the client-side.
Most email clients have an option to save sent mail to "Sent" folder, but quite few of them can save it to other folders.

[Per Recipient Sent Folders]: http://squirrelmail.org/plugin_view.php?id=281

This script tries to solve this sorting problem.
It runs on the server and monitors the "Sent" folder for new files (using `inotifywait`).
When it finds one, it extracts an email address from its "To" header (using `mu view`, but you can also use grep, but be careful if the header wraps in two lines) and uses it to move file to an appropriate folder.

Note that you need to know some shell scripting to adjust this script to suite your taste.
`expr "$to"` lines are used to match only a part of email address (using RegExp),
while email list inside the `case "$to"` is used when you want to match a full email address.

Also note that rules at the bottom of the script have priority (override) over those above them.

	#!/bin/bash
	
	cd Maildir/.Sent/cur/
	
	inotifywait --quiet --monitor --format '%f' --event moved_to . | while read line; do
		to="$(mu view --summary-len=1 "$line" | sed -n '/To:/{s/.*[ <]\(.*@[^ >]*\).*/\1/;p}')"
		dest=''
		# sorting begins here
		case "$to" in
			# compare whole addresses
			("friend@mail.ru") dest='.friend' ;;
		esac
		# compare partial addresses
		expr "$to" : ".*@company.com" >/dev/null && dest='.work'
		[ "$dest" ] && mv "$line" "../../$dest/cur/"
	done;

<script src="/microlight.js"></script>
