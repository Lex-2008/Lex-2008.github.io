title=Block spam from subdomains
intro=If you have a domain and don't want to be blocked for sending spam.
tags=e-mail
created=2015-10-13
modified=2016-12-11
modified_now=1


If you're a proud owner of your own domain (say, `example.com`),
and have an email address with it,
then you probably know what are SPF-records and how to use them
to prevent other people getting unwanted messages with your address
in the "From" field.

But one day you may learn (usually by getting a "bounce" email) that
spammers can send emails from subdomains of your main domain
(say, `bill@office.example.com`).

That's not nice, because:
_a)_ other people are getting spam, and
_b)_ your domain gets visible by anti-spam filters.

To somehow prevent or limit this, you can simply add this wildcard SPF record to your DNS system:

	* IN TXT "v=spf1 -all"

It will tell all email servers that respect SPF that they should **reject** all mail coming from all subdomains of your domain.

**Source**: <http://www.openspf.org/FAQ/The_demon_question>
