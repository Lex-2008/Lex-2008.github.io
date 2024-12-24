title=space2d3 7: colors and interceptions
uuid=36a1f8c7-8630-4cc2-bb4e-bfe9636b6da3
intro=Now you can intercept other ships! They can intercept you, and each others, too!
tags=space2d3
style=
styles=
created=2024-01-21
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

You can also see **names** of all AI-controlled ships, and the main menu now also has an "Acknowledgements" section, which shows you where I got them from.

All ships now also have **colors**, which is _outside_ "paint" of each ship.
_Inside_ of the ship it's a shade of gray, which is at a distance of 50% luminosity in _L\*a\*b_ space from "main" ship color.
If main color is brighter than a 50% gray - then inside it's dark, and vice versa,
but the brighter the outside color is - the brighter it is inside, too.
You can see it by starting new game(s) -
both your ship (if you're starting a hard mode)
and base you're docked to (it's also kind of a ship)
have "primary" and "inside" colors that somehow match.

Aaand the next exciting feature - now both AI and player ships can intercept others!
For now it's free, in future it will use fuel and require the ship to have a working engine(s).

There is an exception, though - you can't intercept a ship which currently is moving to intercept another one.
Original idea behind this is that for two ships to fight or trade,
they need to align their speeds and travel in the same direction, in parallel, for some time.
But in case of a fight, one of the ships might lose all its engines (or fuel),
and won't be able to change its course after.
It is kinda okay if both ships are moving towards a planet already
(after all, ships can somehow move from one planet to another even without engines?),
but such ship will be doomed if a fight happens when two ships are flying
_towards_ an interception point.

But I now think that maybe it's not such a good idea:
I don't like ships flying next to each other for extended period of time,
so maybe after a fight one (intercepting) ship should plot a course to a random nearest planet, instead?

Also, to make it easier to intercept other ships,
I've (temporary) disabled radar limits -
i.e. everyone can see anything. :)
Also, AI ships are very eager to intercept others -
this is **very** good for debugging purposes,
but will be tuned down in future.

I also changed "human" symbol from letter A
(which after some time started looking like a fish head for me)
to letter T
(which is like a top-down view on a human with a very long nose).

The localStorage slot where the game is auto-saved was also changed
(I encountered some issues during development,
and don't want to bother readers of my blog with debugging them).
If you want to port your old savegame to the new one -
execute the following command in your JS Console:

	localStorage.space2d3_3=localStorage.space2d3_2

But don't hold me responsible for any issues it might cause :)
And to clear localStorage - either use your browser tools, or the following command:

	localStorage.clear()

To play the game in its current state, [click this link][g] or look into the iframe below:

[g]: space2d3-7-colors-and-interceptions/

<div>
<iframe src="space2d3-7-colors-and-interceptions/" width="682" height="500"></iframe>
</div>
