title=Dovecot default email order
PROCESSOR=Markdown.pl
intro=How to change it, if it matters
tags=e-mail
created=2014-08-27
modified=2016-06-16
modified_now=1


For some programs it might matter, in which order `LIST` IMAP command shows emails by default.
For example, it might be the reason behind [Issue 726][k9] for K-9 Mail.
Or, at lest, it was for me.

[k9]: https://code.google.com/p/k9mail/issues/detail?id=726 "wrong date-order in imap-folders after copying"

To fix it in dovecot IMAP server while using maildirs, you can do the following:
move all mails to a hidden directory and copy them back one-by-one, issuing `doveadm index` command after each mail.

These are the commands:

	sudo service dovecot stop     # stop dovecot server to prevent influence
	cd ~/Maildir                  # cd to a target folder
	rm -f dovecot*                # remove all dovecot indexes
	mkdir hid                     # make hidden directory
	mv cur/‌* hid/                 # move all mails there
	for file in $(ls -rt hid); do # walk through all mails, starting with oldest one
		mv hid/$file cur/         # move a file back
		doveadm index INDEX       # rebuild dovecot index
	done
	rmdir hid                     # remove temporary directory
	sudo service dovecot start    # start dovecot server

Note that you can do it for any IMAP folder, just change `~/Maildir` and `INDEX` to paths to the same folder in filesystem and on IMAP server.

<script src="/microlight.js"></script>
