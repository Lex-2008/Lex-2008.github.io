title=When not to use Alpine
intro=When you use scripting languages and want to squeeze some performance.
tags=bash linux python
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

* [SquirrelMail][] webmail (latest stable version snapshots (1.4.23-svn)) under php7.4 with [abook_carddav][ab] plugin, using one of these:

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
which was fething all contacts from CardDav address book,
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

Indeed, subjectively, with PHP servers running under Debain, websites feel more responsive.

One might notice many shortcomings in my testing method:
changing not only OS, but also webserver and sometimes even PHP version,
using a VPS for performance testing,
and testing over network.

But such critics are welcome to repeat this testing themselves -
I **will** include a link to your results on this page,
also if they don't agree with mine.
Moreover, I'm probably more interested in results which are different than mine!

Some more links:

* [python3.5 on docker alpine is slower than docker ubuntu](https://github.com/gliderlabs/docker-alpine/issues/300)

* [Performance issues with php:7*-alpine containers](https://github.com/docker-library/php/issues/592)

* [Why is the Alpine Docker image over 50% slower than the Ubuntu image?](https://superuser.com/questions/1219609/why-is-the-alpine-docker-image-over-50-slower-than-the-ubuntu-image) - also linked at the top of this article
