title=Passwords
uuid=1715cfaa-3d9b-4a82-ab64-302bb951d640
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
intro=How to generate them, so you could store them in your head
tags=security links
styles=
created=2014-06-20

Simplest way to get a password is to use some online password generator service, for example [duckduckgo.com][] search engine. But such meaningless passwords are usually considered quite easy to crack, while quite hard to remember.

One of solutions would be to use a paper with all your passwords written on it.
phtree.org website had an interesting (but quite lengthly, I must admit) article on how to keep passwords for all websites "encrypted" on a single square piece of paper. [Archived version](http://archive.is/hbyUJ) preserved on archive.is.
Good thing is that the only thing you'll have to remember are the rules (described in that article) on how to make the passwords, you don't have to remember any single thing for each password individually.
Bad thing is that if the paper is stolen, then all your passwords are in danger (note, however, that it's not the same as keeping all your passwords openly written on a paper - this piece of paper needs some work before being decrypted).

Another idea is to use _pass**phrase**_ instead of _pass**word**_, because it's easier to remember (consists of words) and harder to crack (has more combinations even when using a small subset of words).
There are ongoing arguments on how "strong" such passwords are comparing to "normal" ones, and [lightbluetouchpaper.org][] [(archived copy)](http://archive.is/pFkNU) tries to give the most scientific-based approach to it.

To generate them you can use, once again, a website: for example, [preshing.com][] (it also has an [xkcd][] comic on the subject), or, if you're a lucky Linux user, a simple bash script. [There is one](http://archive.is/wSFtt) preserved on archive.is - this page also has one more explanation of difference between password and passphrase.

[duckduckgo.com]: https://duckduckgo.com/?q=password
[phtree.org]: https://pthree.org/2014/03/19/creating-strong-passwords-without-a-computer-part-iii-off-the-grid/
[lightbluetouchpaper.org]: https://www.lightbluetouchpaper.org/2012/03/07/some-evidence-on-multi-word-passphrases/

[preshing.com]: http://preshing.com/20110811/xkcd-password-generator/
[xkcd]: http://xkcd.com/936/

**Update from 2017-09-05**: there is an interesting passphrase generator from Aaron Toponce (author of phtree.org website): [blog post][] preserved on archive.org, [github][], [generator itself][], [locally cached version][c], offering a choice of several dictionaries to choose from, with my favourite until recently was "Simpsons" one from "Alternate" section, generating easy-to-remeber passwords like "_steal french members motion stupid stand_".

[blog post]: https://web.archive.org/web/20230405205017/https://pthree.org/2017/09/04/a-practical-and-secure-password-and-passphrase-generator/
[github]: https://github.com/atoponce/webpassgen
[generator itself]: https://atoponce.github.io/webpassgen/
[c]: /cache/webpassgen/
