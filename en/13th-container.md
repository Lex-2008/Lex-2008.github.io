title=13th container
uuid=5f2f50e9-7bd3-4c61-8f77-e14ecd6c7e63
PROCESSOR=Markdown.pl
tags=postfix
intro=With <a href='https://github.com/Lex-2008/containers/tree/master/dehydrated.cont'>dehydrated</a> being 12th container to be added to my infra, this is 13th.
created=2021-11-14

Why
---

So I have a friend, who is unlucky enough to use mail server and client which both
don't validate sender of incoming messages themselves and
don't provide enough information for the user to do this:
even if sending server has strict DMARC and SPF records,
their server is happy to accept incoming messages from strangers and blindly trust the sender whoever they claim to be.
And client does the same, slapping contact's photo from address book on top of the message.
Moreover, the friend is in danger of being a victim of mail spoofing attack, for some reason.

However, their mail client supports checking S/MIME signatures,
so they convince all their friends, me included, to sign all outgoing messages with it.
Messages with valid S/MIME signatures get a happy green padlock (or is it a checkmark?),
verifying that it's indeed the correct sender and not a spoofer.

Sadly, my mail client doesn't support adding these signatures.
So what can be a solution here?

How
---

After researching possibility of using s/mime milters,
I found a [`transport_maps`][p-tm] Postfix option.
It lets you configure what SMTP servers to use when sending messages to specific recipients.
For example, I can configure Postfix in such a way that when it wants to send a message to this particular recipient,
it should use a special dedicated SMTP server.
And for the purpose of S/MIME signing, we can write a simple Python SMTP server
that will receive messages from Postfix via SMTP
(thanks to [this Stack Overflow answer][so1] for providing an example Python SMTP server),
add S/MIME signature
(using smail python library and [example][smail2] from it),
and send it to upstream SMTP server
(using Python smtplib and [example][smtplib3]).

[p-tm]: http://www.postfix.org/postconf.5.html#transport_maps
[so1]: https://stackoverflow.com/a/2691249
[smail2]: https://pypi.org/project/python-smail/#signing
[smtplib3]: https://docs.python.org/3/library/smtplib.html#smtp-example

Installation and usage is described in [relevant README][readme].

[readme]: https://github.com/Lex-2008/containers/blob/master/padlock.cont/README.md#installation

Notes
-----

Note that at the moment, only a single upstream server is supported, which is currently hardcoded to be gmail MX server, so as of writing it's useful only for messages sent to a `@gmail.com` address. That's fine for me, but [PR][]s fixing this are welcome!

[PR]: https://github.com/Lex-2008/containers/edit/master/padlock.cont/data/serv.py

Also note that since signing key is stored on the server, this does **not** add any extra security compared to DKIM signature.
As said before, the only purpose of this server is to satisfy those email clients/servers/users who can't/don't check/show DKIM signatures, but have an option to check/show S/MIME ones.
