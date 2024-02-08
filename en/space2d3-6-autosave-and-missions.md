title=space2d3 6: autosave and missions
intro=Now your game doesn't disappear as soon as you reload the page, and also you can complete missions!
tags=space2d3
style=
styles=
created=2024-01-06
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

On the first page load, you're presented with a choice:
you can either start with a small ship with only one cargo bay,
or with a bigger ship with 15 random components.

After that, game autosaves into your browser localStorage each time you arrive at the station
(including right from the start),
and is automatically loaded each time you refresh or open the page anew.

To start a new game, use the _[trigram for heaven][t]_
(also sometimes called "hamburger") &#9776; menu in top-left corner.

[t]: https://graphemica.com/%E2%98%B0

Bases (stations) now also have a "Mission Computer" component, which offers you two kind of missions:
either deliver "mission boxes" to a random planet in same star system,
or buy a component for 20 units of planet's desired resource.

So now you can build your ship as big as you want!
Next step is to add a way to decrease your ship size,
also known as "fighting with other ships" :-)

There are some bugs, though: mission rewards are set randomly every time you arrive to a planet,
but unfortunately it happens _after_ the game is loaded, so they are not preserved between game loads.
As a result, you can easily keep refreshing the page until you get the reward you wanted!
That's unfortunate.

To play the game in its current state, [click this link][g] or look into the iframe below:

[g]: space2d3-6-autosave-and-missions/

<div>
<iframe src="space2d3-6-autosave-and-missions/" width="682" height="500"></iframe>
</div>
