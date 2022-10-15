title=space 2d 1: a game which plays by itself
PROCESSOR=Markdown.pl
intro=a humble beginning
tags=space2d
created=2021-04-11

So I have a [three-dimensional space _shooter_ game][3d], a [one-dimensional space _adventure_ game][2d], so now it's time for a two-dimensional space _strategy_ game.

[3d]: space-10-finished-game-about-combat.html
[2d]: space-1d-8-colors-stats-challenge-mode.html
[ST]: https://en.wikipedia.org/wiki/Space_Trader_(Palm_OS)

Actually, it's planned to be adventure-which-turns-into-strategy game:
players first will be playing as a _Space Trader_ flying between planets trading goods,
then (having earned enough money) they will be able to create a company and own factories producing goods,
and later - create a country, own planets and even roll out their own currency!

And all this - in the same world, surrounded by the same familiar planets.
I'm striving to reproduce the same [feel of attachment][at] I enjoyed in a different game.

[at]: https://youtu.be/sn_ERwCzJ0k?t=186

Moreover, the world around player is not static: eventually you will reach the end of territory controlled by your home country - and witness either uncolonized planets being colonized, or a war happening between two or more countries.
You can easily cross borders, switch sides (buy robots on one side and sell to another, as long as you have enough money), and see planets changing hands.

What happens with buildings when their planet get a new government?
They start receiving salary in a different currency, that's all!


Current state
-------------

To see current state of the game, [click here][c].

[c]: space-2d-1-a-game-which-plays-by-itself/triangles.html

What should you see here?
Hopefully, a galaxy map which you can drag around and zoom using mouse wheel.
A bunch of planets - circles: colonized planets are highlighted by color of their government
(there is no such thing as "free planet" in this game - all planets have a government), empty planets are dull gray.
Lines between planets show which are connected - such planets are called "neighbours",
and if three neighboring planets belong to the same country - triangle between them is highlighted in their countrys color.

Next, if you zoom to some of colonized planets, you will see small box with condensed information about each of them.

First row shows three numbers:

* planet number - in future versions all planets will have names, but for now best name we have is a number.

* planets _distance to war_ - how many lines you need to travel from this planet in order to reach a planet which is either not colonized or belongs to a different country.

* planets _value_ - how much AI likes this planet. Currently it's just a production of robots per turn.

Each of the following rows show three numbers corresponding to current state of three resources existing in this game: fuel, ore, robots.
Fuel is produced on refineries and is required by mines and factories to function.
Ore is produced in mines and is required by factories to function.
Robots are produced on factories and are required by refineries and mines to function.

* Row with letter "Q" shows planet _quality_ - how many units of fuel, ore, and robots do refineries, mines and factories produce every turn.

* Row with letter "P" shows _price_ of each of these goods.

* Row with letter "I" shows _income_ that each of these buildings brings to their owners every turn.

* Row with letter "S" shows current _storage_ of these goods on this planet.

* Row with letter "B" shows amount of building of each type.

Bidding
-------

Planets are "owned" by entities called "countries" (and they fight with each other), and
buildings are owned by entities called "companies" - they earn money and spend them on purchasing new buildings.

This is done via a "bidding" process: when a planet has a surplus of robots, it spends them to create a new building.
Until next turn, companies can bid for this building - and highest bid wins.

That goes against usual process of "company acquires resources and builds something", but protects prices from insane fluctuations.
If you have a better idea how to implement this - please let me know! Email is click-protected at the bottom.
