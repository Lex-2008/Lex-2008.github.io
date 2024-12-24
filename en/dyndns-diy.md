title=DynDNS DIY
uuid=fdb36681-ed39-4014-9d3b-4bf94214ae2a
PROCESSOR=Markdown.pl
intro=Why use someone else's Dynamic DNS server, if you can <i>easily</i> run your own?
created=2021-10-10
tags=net bind

Over the time, I grew dissatisfied with free DynDNS services:

* Some of them wanted money

* Some of them didn't support IPv6

* Some of them wanted me to verify my account every few months

* Some of them had more than one drawback from above three

Best of all is [freedns.afraid.org](https://freedns.afraid.org/), which asked me to confirm my account only once so far.

But I still wandered how hard is it to implement that.
Turns out, not at all!
Basically, you need to have a bind server running as an _authoritative_ server for a zone,
tell it to accept commands to change it,
and give proper commands to `nsupdate` utility.

All the changes lives basically it two files:

* [named.conf](https://github.com/Lex-2008/containers/blob/master/bind.cont/data/named.conf) -
	the bind configuration, where the only relevant change is this line inside a zone:

		update-policy { grant ddns-key zonesub ANY; };

* [this script](https://github.com/Lex-2008/containers/blob/master/dyndns.cont/data/dyndns.sh)
	which gives the proper commands to `nsupdate` utility, like this:

		echo "
		del $host A
		add $host 1 A $ip
		send" | nsupdate -k /key.conf

Note that currently this script is tightly coupled with my containers infrastructure:
it expects to be located behind an nginx reverse-proxy which checks authentification and
sets proper headers with username (which becomes subdomain) and remote IP address.
Also note the location of key.conf file which is expected to be shared between
"bind" and "dyndns" containers.

[Installation](https://github.com/Lex-2008/containers/blob/master/dyndns.cont/README.md)
is pretty easy, and the result lives at _dyn.shpakovsky.ru_.
