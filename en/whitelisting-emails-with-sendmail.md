title=Whitelisting emails with sendmail
intro=So they weren't rejected by dnsbl spam filter
tags=e-mail
created=2015-10-27
modified=2016-12-11
modified_now=1


Recently I became annoyed by growing amount of spam messages I was receiving.

Previously I had a simple spam filter, which worked according to this logic:

> messages from contacts in my address book should go to inbox,  
> other messages should go to trash

I'm not very popular person in the Internet, so I am rarely contacted by someone
I didn't contact before (actually, **never** during last year),
so it worked fine.

Actually I was checking what mail was considered spam and found some cases which one could consider false positives
-- so called "news" mails from websites where I registered.
I never was very interested in them, so this logic worked even better then expected.

However, one day I got tired by increasing amount of garbage coming into my trash
and decided to give a shot to some spam-filter.

Sendmail has a built-in support for [dnsbl][] filters,
which check IP of the server trying to give you a message,
and if this server was known to send spam before - reject the message.

[dnsbl]: https://en.wikipedia.org/wiki/DNSBL

Of course, this technology can also give false positive results,
so people usually advice to combine several dnsbl lists with scoring system and
with other antispam technologies (word filters, signature checking, etc).

I already had a nice-working spam-filtering logic, so wanted to combine it with
the new one on the rules like this:

> messages from contacts in my address book should go to inbox,  
> other messages should go to the spamfilter
> (and if they pass it - to trash)

And, turns out, it's quite easy to do for those who keep address book on the mail server.
All you need is to extract all addresses from your address book and add them to `/etc/mail/access` file.



Requirements
============

Below steps are for the following case:

* Address book is in SquirrelMail format at `/home/alexey/alexey.abook`
  (you can make links if it's in another place)

* Mail server is sendmail and it's installed on the same server

* Preferred dnsbl source is `rbl.rbldns.ru`

For different cases steps should be adjusted more or less.



Steps
=====

1. Check that your `/etc/mail/sendmail.mc` has the following lines:

		FEATURE(`dnsbl', `rbl.rbldns.ru')dnl
		FEATURE(`access_db')dnl
		FEATURE(`delay_checks')dnl

  (first line enables dnsbl,
  second enables email address check,
  third delays dnsbl check until after email address check)

2. Add this line at the bottom of `/etc/mail/access` file:

		### AUTOMATED LIST BELOW

3. Put this script to `/etc/cron.daily/mail-whitelist`:

		#!/bin/bash

		sed -ni '1,/### AUTOMATED LIST BELOW/p' '/etc/mail/access'
		cut -d \| -f 4 /home/alexey/alexey.abook | sed 's/$/ OK/' >>'/etc/mail/access'
		makemap hash '/etc/mail/access' < '/etc/mail/access'



Result
======

Result was somewhat interesting:
I'm now getting only one spam message per day (versus 50 before) -
as I see, usually sent via "official" mail servers of big email companies.
However, number of log entries for "rejected" messages is four times higher
then number of spam messages before -
looks like spam bots keep retrying after being rejected.
Oh well.


* * *

**Note**:
For someone interested, my "old" filter is implemented by this simple rule in `~/.procmailrc`:

	FRIENDS=`cut -d \| -f 4 $HOME/alexey.abook | tr '\n' '|' | sed 's/|$//'`
	
	:0:
	*$ !^From:.*($FRIENDS)
	$HOME/Maildir/.Trash/

Note that it works for me because I'm using Maildir for storing email messages
(note `$HOME/Maildir/` in the script above),
`procmail` for sorting it,
and SquirrelMail for keeping my address book
(note `$HOME/alexey.abook`).

<script src="/microlight.js"></script>
