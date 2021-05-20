title=Containers
intro=How I decided to (re)configure them
created=2021-05-09
tags=Containers

Intro
-----

Containers are nice:

* They force you to be careful about storing your **configuration**:
instead of modifying vendored config files in various places,
you should either "bake" your config into image
(thus, likely, documenting all changes in Dockerfile),
or expose few files/dirs to the container
(thus, likely, limiting your config to only few files).

* They are good for **portability**:
if you rented a cloud VM ~10 years ago and it's less than supported time for the OS you installed at that time,
then you have to either upgrade it to new version
(which is, well, risky),
or migrate your config to a new clean installed version,
and what did I tell you about 
modifying vendored config files in the bullet point above?

* They are good for **security**:
based on Linux security features (like chroot),
they might be not as secure as separate VMs running on the same host
(although this is questionable),
and definitely not as secure as your own physical hardware
behind a bullet-proof door,
but still better than nothing.

	After all, why let your world-exposed SMTP server access the mail you've already received?
	Or why not separate you HTTPS certificates from PHP scripts you downloaded from Internet,
	which might (or might not) contain vulnerabilities, PHP shells, etc?
	Or from your e-mails?

	Of course, one might say that containers are not _made for_ security,
	but I will answer that no wall is impenetrable, and extra layer of security is better than lack of it.

Birds-eye view
--------------

![containers overview](containers.svg)

Here's how containers should cooperate with each other:

* [nginx][] container is the only one exposed to the Internet,
and all SMTP, HTTP, and HTTPS requests come there.
It manages all SSL stuff, including STARTTLS encryption layer for SMTP,
and forwards plaintext HTTP and SMTP requests to backend servers.
It might also serve static sites.

	Note that it's the only container having access to the SSL certificates.

* SMTP is forwarded to [Postfix][] container, together with XCLIENT which gives Postfix information about remote server.

* Other backend servers are [SquirrelMail][] for webmail and [Baikal][] for calendar/address book sync,
both of which are implemented in plain PHP.

	Sadly, they don't share address book format so have separate address books.

* [Dovecot][] container receives messages from Postfix via [LMTP][] and offers them to SquirrelMail via plain IMAP.

* Also Postfix uses [DKIM][] milter which is also in separate container - just because it's possible.

* However, [Sieve][] mail sorter used to sort incoming ([and outgoing][sieve-out]) messages runs in the same container as Dovecot -
because it's implemented as Dovecot plugin, making it not that easy (if possible at all) to put it into a separate container.

Links are supposed to be to future posts about individual containers:

* [nginx][]

* [Postfix][]

* [SquirrelMail][]

* [Baikal][]

* [Dovecot][]

* [Forwarding mail from Postfix to Dovecot via LMTP][LMTP]

* [OpenDKIM][]

* [Sieve][]

* [Sorting sent messages with Sieve][sieve-out]

All sources and relevant configs are available in my [containers repo][repo] on GitHub.

If the one you'd like to read is missing - drop me a line (link at the bottom of this page)!
Also, the picture above was created with [PlantUML][p1].

[nginx]: https://github.com/Lex-2008/containers/blob/master/nginx.cont/README.md
[Postfix]: https://github.com/Lex-2008/containers/blob/master/postfix.cont/README.md
[SquirrelMail]: https://github.com/Lex-2008/containers/blob/master/squirrelmail.cont/README.md
[Baikal]: https://github.com/Lex-2008/containers/blob/master/baikal.cont/README.md
[Dovecot]: https://github.com/Lex-2008/containers/blob/master/dovecot.cont/README.md
[LMTP]: https://github.com/Lex-2008/containers/blob/master/dkim.cont/README.md
[OpenDKIM]: https://github.com/Lex-2008/containers/blob/master/dkim.cont/README.md
[Sieve]: https://doc.dovecot.org/configuration_manual/sieve/configuration/
[sieve-out]: https://doc.dovecot.org/configuration_manual/sieve/plugins/imapsieve/

[repo]: https://github.com/Lex-2008/containers
[p1]: http://www.plantuml.com/plantuml/uml/LP0zImGn48Rx-HLJAockNOvm81Q2M5a8QX4lepTS9XkJYPp_NjmrRj84yippllau57LPgmGuiISaIVgDdienSrAU8y3prIiQY_63usN28ffUuadRMW2AEYLCSz5tli3YeJ6saJLp_NHpVtVxy3ZQEzplANfhuG-WgLjojqRR2VxCidd1s8LCA1oKyhyrVz5nraqqjh49GrTNFYldJ44S1-WtQ_Tm-t4-LBAur3sw5oVy_I7efc-Epwxn0qLV9Vm0
