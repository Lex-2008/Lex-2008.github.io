title=space2d2 1: a simple game about flat space
intro=Making a properly balanced economy simulator is pretty hard, as it turns out. But can I make a simpler 2d game?
tags=space2d2
style=
styles=
created=2023-03-12
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Let's try this: you have a ship, and can travel between stars, and between planets of each star.
Each planet buys or sells some kind of resource, and your ship can carry only one unit of cargo at a time.
To keep things simple, there are four kinds of resources: water, iron, food, and radioactive materials.
You just need to find pairs of nearby planets satisfying each other's supply-demand.
Sounds simple?
To make it even simpler, there's no "prices" or "money" in this game:
when "buying" something, you don't "spend" anything,
and when "selling" - all you get is "+1" in some kind of stats.
You can imagine that all resources are sold for the same price,
and are bought (by planets) for same price +1,
and at the start of the game you have exactly this amount of money.
Or that the planet where you (eventually) sell your cargo
will wirelessly transfer costs to the planet which sold it to you.
Whatever.

But, to prevent you from looping through the same set of planets over and over again,
there is a simple rule: you can visit each planet and each star only once.

In advanced ("hard") mode, you additionally can't cross your own path (where you've already been).
This will make planning harder, since after crossing the star system once through center,
you'll end up with two options where to continue your journey.
Also, you will be limited by stars where you can travel _next_,
since travelling to them is done through "portals", and you must get to one in order to travel.

In "real"(-time) mode, if we get to it, travelling between stars takes 10 hours of real time.
By contrast, travelling through all planets of a single star takes a second of real time,
so you can carefully lay plan of your trip (through a star system), before actually executing it.

But that's all ideas.
What currently implemented is only a "random star generator",
which you can see below.
Reload this page to see a different star system below.
Hover planets to read their description,
and consider in which order you would visit them.
Remember: your ship can carry only one item of cargo,
and you can visit each planet only once.

Good luck!

<div style="text-align:center">
<canvas id="myCanvas" width="500" height="500"></canvas>
<div id="hints" style="height:4em">Hover an object on the map to see what it is</div>
<script src="space2d2-1-a-simple-game-about-flat-space/utils.js"></script>
<script src="space2d2-1-a-simple-game-about-flat-space/planets.js"></script>
<script src="space2d2-1-a-simple-game-about-flat-space/stars.js"></script>
<script src="space2d2-1-a-simple-game-about-flat-space/draw.js"></script>
<script src="space2d2-1-a-simple-game-about-flat-space/hints.js"></script>
<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var star=new Star();
draw_star(ctx,star);
setupHints(star,c,document.getElementById('hints'));
</script>
</div>
