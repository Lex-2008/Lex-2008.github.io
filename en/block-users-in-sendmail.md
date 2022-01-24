title=Block users in sendmail
intro=How to disable mail receiving by local users without deleting their accounts
tags=e-mail
styles=archive
created=2014-09-13
modified=2016-06-24
modified_now=1

On my server, sendmail is configured to receive mail for all local users.
And that includes "system" users, like `root`, `backup`, and `mail`.
So how can one forbid them to receive email, without deleting their accounts?
That's actually quite easy.

* * *

First, enable relevant sendmail feature: open the file `/etc/mail/sendmail.mc`
and add this line somewhere in it:

	FEATURE(`blacklist_recipients')

After that, rebuild the actual sendmail config and restart sendmail:

	cd /etc/mail; make; service sendmail restart

* * *

Second, edit `/etc/mail/access` file and add `REJECT` rules for them, like this:

	backup@shpakovsky.ru	REJECT

After that, rebuild the actual database:

	makemap hash /etc/mail/access < /etc/mail/access

* * *

And last, test it: write an email to forbidden e-mail address and enjoy
automated response from MAILER-DEMON :-)

More information regarding anti-spam protection you can find
[in the official sendmail documentation](http://www.sendmail.com/sm/open_source/docs/m4/anti_spam.html) [(archived version)](http://archive.is/mnRVL).
