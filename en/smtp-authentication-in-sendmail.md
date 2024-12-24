title=SMTP authentication in sendmail
uuid=d6f01305-fb57-4892-87d0-908190c94344
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
intro=By default sendmail is configured in such a way that any program running on localhost can send an email without password, and none from another computer can do that. But what if you want to change that?
tags=sendmail
created=2014-08-25

> **Update**: Note that long after writing this guide, I've switched to Postfix as my mail server, so this guide was correct at the time of writing, it might be obsolete and/or incorrect at the time of reading.

This guide is inspired by [Chapter 12 of Linux Home Server HOWTO][sendmail-server] and [official sendmail documentation][sendmail-auth].
Please read them if something's unclear.

[sendmail-auth]: http://www.sendmail.org/~ca/email/auth.html
[sendmail-server]: http://www.brennan.id.au/12-Sendmail_Server.html

Installation
------------

On Ubuntu server 12.04 most required packages are already installed, and only authentication modules for SASL are missing (SASL is a library used to check username and password).
To install them, just type:

	apt-get install libsasl2-modules



Configuration
-------------

First, to make sendmail use SASL, add this line somewhere in the middle of the `/etc/mail/sendmail.mc` file:

	include(`/etc/mail/sasl/sasl.m4')dnl


Next, to allow incoming connections, remove `"Addr=127.0.0.1"` from `DAEMON_OPTIONS` lines in the same file, to make them look like this:

	DAEMON_OPTIONS(`Family=inet,  Name=MTA-v4, Port=smtp')dnl
	DAEMON_OPTIONS(`Family=inet,  Name=MSP-v4, Port=submission, M=Ea')dnl

After editing `/etc/mail/sendmail.mc` file, rebuild sendmail config by issuing the following command:

	sendmailconfig

### Passwordless access from localhost

Now sendmail would relay (send email to foreign hosts) only when provided a password.
If you want to return the ability to send email from localhost without a password, first edit `/etc/mail/access` file:
comment out everything but `localhost` and issue the following command to rebuild access database:

	makemap hash access < access


After that, add this line somewhere to `/etc/mail/sendmail.mc` file:

	FEATURE(access_db)dnl

And run `sendmailconfig` again.


### Files and settings

Settings are scattered in these files:

`/etc/mail/sasl/sasl.m4` defines how sendmail uses SASL library: settings
`confAUTH_MECHANISMS` and `TRUST_AUTH_MECH`
show what authentication methods are supported and authorize user, respectively
(that's about methods to transfer password from e-mail client to sendmail).

`/usr/lib/sasl2/Sendmail.conf` shows how SASL checks if the password is correct.
By default it says
`pwcheck_method: saslauthd`
what means that it uses SASL auth demon.

Configuration for this demon is stored in
`/etc/default/saslauthd`
file, which by default has a line
`MECHANISMS="pam"`
which means "use system method" (by default, username+password for local account).

These settings can be changed, but that's out of scope of this article, sorry.



Follow-up
---------

To better secure your email (and its password!), you probably want to setup SSL connections, too.
To do that, you need an SSL certificate and just perform first three steps from [official guide][tls].

[tls]: http://www.sendmail.org/~ca/email/starttls.html
