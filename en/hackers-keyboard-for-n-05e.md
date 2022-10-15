title=Hacker's Keyboard for N-05e
PROCESSOR=Markdown.pl
intro=Compatibility patch
tags=Android
created=2017-05-20

Hacker's Keyboard is a software keyboard for Android, featuring a full 5-row keyboard with arrows, Tab, Esc, Ctrl keys.
Also it has a "normal" 4-row keyboard layout, and you can easily switch between them.

Usually, phone users enable 5-row keyboard in landscape mode,
and 4-row one in portrait mode;
while on a tablet you can set it to always use 5-row keyboard.

Recently I [acquired][kyoex] a nice [NEC Medias W N-05e][verge] phone with a unique 2-screen design.
Thanks to this, it's kind of a 2-in-1 device: it can function both as a 4" phone, and as a 5.42" tablet.
And in phone-portrait mode, I expect it to show me a 4-row keyboard,
while in tablet-portrait mode - a 5-row one.
In other words, keyboard size should actually depend not on phone orientation, but on screen width
(actually, it's more logical if you think about it for a bit).

Unfortunately, this keyboard didn't offer such feature out-of-the-box,
but luckily it's an [open source software][OSS], so I could [easily modify][github] it!

And the compiled *.apk file is [here][].

Note that as long as there are no [other][] [similar][] [devices][] which can function as both phone and a tablet,
I assume that I'm the only one who needs such keyboard, and release it in "works for me" state:

* there is no configuration regarding the "landscape" and "portrait" screen width

* dictionaries probably don't work

If there are other users of Hacker's keyboard who need this patch - please write me (email at the bottom of this page)
- I'll be more then happy to learn what kind of device you have!
And maybe will consider to improve it.

[kyoex]: http://www.kyoex.com/docomo-nec-n-05e-medias-w-dual-screen-smartphone-unlocked/

[verge]: https://www.theverge.com/2013/1/21/3902140/nec-medias-w-hands-on

[OSS]: https://ctrl.blog/entry/choose-linux

[github]: https://github.com/Lex-2008/hackerskeyboard/commit/ff30ef678ebc0a23a66c315e3abb14cf7c7faa78

[here]: hackers-keyboard-for-n-05e.apk

[other]: https://www.theregister.co.uk/2014/06/02/asus_launches_5in_1_androidwindows_phonelaptoptablet/

[similar]: https://www.youtube.com/watch?v=lXBdT4tfwdo

[devices]: http://www.dailymail.co.uk/sciencetech/article-3519786/Samsung-s-foldable-phone-double-tablet-Radical-gadget-set-release-2017.html
