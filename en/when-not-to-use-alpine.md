title=When not to use Alpine
uuid=14833a5a-cdde-4a08-8245-ac86cef2b03e
PROCESSOR=Markdown.pl
intro=When you use scripting languages and want to squeeze some performance.
tags=linux python
created=2021-07-11

Intro
-----

[Alpine][a] is a nice and small Linux distro, very popular among container creators.

As many know, it uses [musl libc][m] library (after all, it mentioned on the [Alpine][a] website main page!),
which is an alternative to more popular [GNU glibc][g].

Unfortunately, it looks like it has some [performance issues][so] with scripting languages like Python, PHP, and bash.

[a]: https://alpinelinux.org/
[m]: https://musl.libc.org/about.html
[g]: https://www.gnu.org/software/libc/
[so]: https://superuser.com/a/1234279

And my experience confirms this.

Testing setup
-------------

Recently I converted my server setup to using separate [containers][] for various services:
Postfix SMTP server, SquirrelMail webmail server, Baikal CardDav server, etc - see repo for details.
It lets me have several containers running simultaneously, with different, even conflicting, programs:
various OSes, webservers, etc.

Test bench contains of two PHP services:

* [SquirrelMail][] webmail (latest stable version snapshot (1.4.23-svn)) under php7.4 with [abook_carddav][ab] plugin, using one of these:

	* Either Lighttpd webserver under Alpine - [dockerfile][sq1]

	* Or Apache webserver under Debian - [dockerfile][sq2] based on [php:7-alpine][php]

* [Baikal CardDav][baikal] server 0.8.0, using one of these:

	* Either Lighttpd webserver with php7.4 under Alpine - [dockerfile][b1]

	* Or ngnix webserver with php8.0 under Debian - using prebuilt docker container from [ckulka/baikal][] which is built on top of [nginx:mainline][nginx].

[containers]: https://github.com/Lex-2008/containers
[SquirrelMail]: http://squirrelmail.org/
[ab]: https://github.com/Lex-2008/abook_carddav
[baikal]: https://sabre.io/baikal/
[sq1]: https://github.com/Lex-2008/containers/blob/46f32475ae9887a88685d4c548c2712c036dfefa/squirrelmail.cont/build/Dockerfile
[sq2]: https://github.com/Lex-2008/containers/blob/4510700e6ae1cf18ec07770f2637ef2e8e8f72d0/squirrelmail.cont/build/Dockerfile
[php]: https://github.com/docker-library/php/blob/master/7.4/buster/apache/Dockerfile
[b1]: https://github.com/Lex-2008/containers/blob/46f32475ae9887a88685d4c548c2712c036dfefa/baikal.cont/build/Dockerfile
[ckulka/baikal]: https://hub.docker.com/r/ckulka/baikal
[nginx]: https://github.com/nginxinc/docker-nginx/blob/master/mainline/debian/Dockerfile

In both cases, SquirrelMail was running behind reverse nginx proxy.

I was loading main SquirrelMail addressbook page
(`…/src/addressbook.php`)
which was fetching all contacts from CardDav address book,
reloading that page 11 times and recording maximum, minimum, and median values.

Results
-------

And the numbers look like this:

* 633/702/953 (min/med/max) ms with both servers running Alpine.

* 479/522/632 (min/med/max) ms with SquirrelMail running under Alpine and Baikal - under Debian;

* 406/445/479 (min/med/max) ms when both servers run Debian;

You can see more than 2x difference between worst and best values (953 and 406),
and about ⅓ difference between median values on first and last rows (702 vs 445).

Conclusions
-----------

Indeed, subjectively, with PHP servers running under Debain, SquirrelMail feels more responsive.

One might notice many shortcomings in my testing method:
changing not only OS, but also webserver and sometimes even PHP version,
using a VPS for performance testing,
and testing over network.

But you are welcome to repeat this testing themselves -
I **will** include a link to your results on this page,
also if they don't agree with mine.
Moreover, I'm probably more interested in results which differ from what I got!

Some more links:

* [python3.5 on docker alpine is slower than docker ubuntu](https://github.com/gliderlabs/docker-alpine/issues/300)

* [Performance issues with php:7*-alpine containers](https://github.com/docker-library/php/issues/592)

* [Why is the Alpine Docker image over 50% slower than the Ubuntu image?](https://superuser.com/questions/1219609/why-is-the-alpine-docker-image-over-50-slower-than-the-ubuntu-image) - also linked at the top of this article


Update from 2021-09-21
----------------------

Also, note that musl library [does not not support][musl-dns-o-tls] DNS-over-TLS.

It means that if a DNS response doesn't fit into a single UDP packet - musl library users won't able to read it.

Musl author says that they should use more advanced dedicated DNS libraries for that.

But if your app developer doesn't agree - then you're out of luck.

_It looks like_ that's what happened to me with [Alpine opendkim container][alpine-opendkim].

[musl-dns-o-tls]: https://twitter.com/RichFelker/status/994629795551031296
[alpine-opendkim]: https://pkgs.alpinelinux.org/package/edge/community/x86/opendkim
