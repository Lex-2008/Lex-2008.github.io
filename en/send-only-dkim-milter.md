title=Send-only DKIM milter
intro=How to configure Postfix to skip milter for incoming messages
tags=postfix
created=2021-11-20

Why
---

Those who are interested in adding DKIM singatures to _outgoing_ email messages (in order to increase deliverability),
but not in verifying singatures of _incoming_ messages,
might want to configure their email system in such a way that **only** _outgoing_ email messages pass through OpenDKIM milter.
Moreover, this gives you an option to set `milter_default_action = reject`,
which means that if your OpenDKIM milter is down or failed to sign your message for any reason,
it will be reject by SMTP server, and you will get a (not so nice) error message in yor mail client
(this part worth testing, though).

How
---

To do this, you just need to configure Postfix mail server to listen on two ports:
one for incoming messages, and one for outgoing ones.
Actually, developers of [dkimpy-milter][] recommend exactly this way of setting up postfix.

[dkimpy-milter]: https://pypi.org/project/dkimpy-milter/

To achieve this, you can for example duplicate the "inet smtp" line in your postfix master.cf file,
adding extra parameters to it like this:

	postconf -M smtp/inet | sed 's/^smtp/26/;s/$/ -o smtpd_milters=/' >>/etc/postfix/master.cf

Then, you can configure smtpd\_milters in postconf main.cf as before
(they will be used for incoming connections to port 25),
and connections to port 26 will be configured to not use any milters at all.

After that, you need to configure one port to be available for outside world on port 25,
and another one - to be available only for your smtp clients.
This depends on your setup, but in my case - running everything in containers -
I just configured incoming connections to port 25 to be routed to port 26 of the postfix container,
and kept webmail client configured to use port 25.

Notes
-----

Actually, it's a bit more complex: nginx running in "host networking" container world-listens on port 25,
handles STARTTLS, stops auth attempts, waits for "MAIL FROM" and "RCPT TO" messages from remote client
and forwards "clean" connections together with XCLIENT info about remote server to localhost:2525 -
which is listend on by Docker daemon which forwards the connection to port 26 of the postfix container.
This is done primarily to keep postfix logs clear from portscan noise and to handle all SSL stuff -
both HTTPS and STARTTLS - in one place.
Also note that postfix container runs in "default" network,
which doesn't allow direct connections from nginx container running in "host networking" mode,
thus requiring usage of localhost port 2525.

Also note that Postfix has built-in feature for this, called [`milter_maps`][p-mm], but we can't use it here,
again due to containers: issue is that milter\_maps is checked during initial connection, _before_ XCLIENT command is received,
so it's checked against IP address of Docker daemon proxy, which is in same network as other containers.
Theoretically [it can even change][docker-ip], so it's better not to expect it to always be "172.17.42.1",
and instead use other ways to distinguish "incoming" and "outgoing" messages - like different port numbers.

Also note that [external mail clients][mail-ext] don't have access to "sending" port 25 of the postfix container.
Sending email from external mail applications is simply not supported at all.

[p-mm]: http://www.postfix.org/postconf.5.html#smtpd_milter_maps
[docker-ip]: https://github.com/moby/moby/issues/17305
[mail-ext]: using-http-basic-auth-for-nginx-mail-auth-http-server.html

