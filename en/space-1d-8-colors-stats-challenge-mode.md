title=space 1d 8: Colors, stats, challenge mode
PROCESSOR=Markdown.pl
intro=Ships now have colors and like you from the first encounter if your ships color is close to theirs. But still, to change it you need to decrease your karma below -1.
tags=space1d
created=2021-03-06
style=iframe {width: 700px; height: 700px; background: white}

Important information for newcomers to my blog:

> It's the latest post about a _1-dimensional game without graphics about space_ which I'm making.
> The game is available in the iframe further down on this page.
> It aims to be self-explanatory just by reading the text :)
>
> Moreover, most of the time it has a safe default option highlighted, which you can activate by pressing "spacebar" key on your keyboard.
> So just keep hitting it, and see the game "play by itself" nicely.

[l]: space-1d-7-ship-names-memory-and-feelings.html
[rc]: https://mokole.com/palette.html
[lab]: https://en.wikipedia.org/wiki/CIELAB_color_space
[er]: http://www.easyrgb.com/en/math.php
[so]: https://stackoverflow.com/q/15408522

[Last update][l] introduced GTA-style "paint shops".
But there were no real colors. So now there are!

Right from start, your ship is assigned a random color.
AI-controlled ships also have [pregenerated][rc] random colors.

These colors don't affect gameplay much,
the only thing that they do affect is initial "feelings" towards your ship set during first encounter.
If colors are "close enough", then AI ship "_likes_" you.
If they are "very close", then they **love** you.

Color distance is computed in [L\*a\*b\*][lab] colorspace,
which aims to describe how similar colors are to human eye
(weird that AI uses it, don't you think?
I also got that idea, but only after the code was done,
so it is how it is).
If distance between colors of player and AI ships is less than 50 in L\*a\*b\* space,
then player rating is set to +1 ("_like_");
if it's less than 30 - then to +2 ("_love_");
if it's less than 20 - then to +3 ("_love very much_").

Functions to convert colors from RGB to L\*a\*b\* were taken from [easyrgb][er] found via [this][so] stackoverflow question.

As with name, in order to change your ship's color,
you need to decrease your karma (average rating among other ships) to less than -1,
and have number of cargo items (rockets and fuel) equal to number of your ship components.

Also, AI behaviour was amended to be more agressive / permissive - so now even in case of near-0 karma
AI ships might attack you - even if they like you - if they see you as a good prey.

Stat reset was also changed to make "per-ship" and global stat resets independent.

But now, I would like to offer you a **challenge**:
how fast (with minimum number of encounters) can you get from 0 karma to paint shops?
Either from start of the game to the first visit of paint shop, or from last karma reset.
The number of encounters is shown on the paint shop screen, at the top of the "Status" box.

Note that while the game doesn't feature any _cheats_, it's pretty trivial to modify its memory,
so no guarantees are possible regarding validity of submissions.

Contesters just need to send me a webpage screenshot when you visit the paint shop.
Additional information is welcome, email at the bottom of the page :)

For comparison, [here][p] is a screenshot of my attempt of getting +1 karma.
Yes, my ship was bigger in the beginning (over 20 components), but some "friends"
prefered fight.

Hint: since you keep your ship during "karma reset",
it worth building a good ship first, and doing a karma reset before rushing down for negative karma.
Also remember that you need both karma<-1, and required amount cargo in order to be qualified to enter paint shop.
Good luck!

<iframe src="space-1d-8-colors-stats-challenge-mode.htm"></iframe>

[p]: space-1d-8-colors-stats-challenge-mode.png
[g]: space-1d-8-colors-stats-challenge-mode.htm

Hint2: If you don't like playing in iframe, you can open the game page directly: either follow [this link][g], or edit this page URL to remove last letter.
So URL ending with `.html` is this page, URL ending with `.htm` is the game only.

Hint3: if you need some cheats - just ask!
