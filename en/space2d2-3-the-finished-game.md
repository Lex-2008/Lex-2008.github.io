title=space2d2 3: the finished game
uuid=e7a5ebff-9cbf-403f-93b5-dc7d6d8a8e3f
intro=A space trading game without money
tags=space2d2
style=
styles=footnotes
created=2023-03-19
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

You play as a space trader, travelling between planets and stars.
You can visit each of them only once.
Moreover, you can't cross the path you already took.
Also, you can carry only one item at a time!

However, you can carefully plan ahead your path through each system.
No rush!

Tutorial
--------

Open [the game][g] in a new tab and continue reading.

[g]: space2d2

On the left you see the map of star system you're currently at.
Move the mouse over the map and hover the planets to check what are they buying and selling.
In the starting system there are three planets:
the green one at the top buys food;
the blue one at the bottom sells water;
the green-blue one on the right buys water and sells food.
Can you guess in what order they should be visited? :)

Click on these planets in the right order - they get connected by a dotted line and added to the "Flight plan" list to the right of the map.
Then, check the checkboxes: where to buy resources, and where to sell them.

After that, you must choose which of the neighboring stars to travel to.
Note that your choice is limited to those stars which are not visited yet and can be reached from the final planet of your flight path[^1].

[^1]: For example, if you follow the recommended flight plan in the starting system -
then you're limited to travelling to one of three neighbours at the top and right.
Neighbours at the bottom can't be travelled to, because travelling to them would cross existing path.


Finally, press the "Execute flight plan and continue to this star" button.
The game has autosave (to `localStorage` / "site data" inside the browser), it happens when you're travelling between stars.

Jobs
----

For each star, the game shows you a number of "jobs" - that's an estimated number of buy-sell operations that, at a first glance, can be done there.
But this is not always possible :)
For example, the star "bright LightBlue" up from your starting star system thinks that there are 4 jobs;
but if you look closely, two of them are the transportation of water from the two planets on the left side of the map to the two planets on the right,
and one more is the transportation of food from the topmost planet to the green one at the bottom of the map[^2].
Not only does this route intersect the other two, it also passes almost through the center of the star!
And we all know what happens to food at high temperatures.

[^2]: [This image][img1] shows all jobs of that system.
Problematic one is highlighted in red.

[img1]: space2d2-3-the-finished-game/img1.png

Also, you can buy something from a planet in one star system and sell it to a planet in another one - and complete more jobs than expected this way!
For example, if you buy food in the starting system, but instead of flying to the green planet, continue to the Peru-colored star to the right[^3],
then there you will be able to complete three jobs out of two!

[^3]: [Here's the image][img2] of that system.
Note the leftmost planet has green color inside of it - it means that it buys food.
Note that no other planet in this system has green color - it means that no other planet in this system sells food,
so selling food to this planet is not counted as a possible job!

[img2]: space2d2-3-the-finished-game/img2.png



Stats
-----

There is no ultimate goal or other "win condition" in this game.
You can, however, check your stats, try to keep them as high as possible, and share with others.
For example, [here][img3] you can see what I achieved while debugging this game.
In my excuse, I can say that sometimes I had to chose less-optimal travel path in order to travel away from some bugs.
Also, I was focusing mostly on "Jobs done per seen" stat,
which is apparently easier to achieve while visiting systems with less jobs available.
Hence, low "Jobs done per star" stat :)

[img3]: space2d2-3-the-finished-game/img3.png

Feel free to share your achievements!
Note, however, that the game runs entirely in a browser, so it's easy cheatable and no verification of results is possible.

Is it really finished?
----------------------

Initially I wanted to add a "travel" animation when you press the "execute flight plan" button,
"easy" mode (where you travel through stars, planets, and your old path),
and "real"(-time) mode (where it takes 10 hours of real time to travel from star to star),
but now I'm not so sure about last two items.
And 1-second animation of "travel through star system" doesn't really make much sense
without 10-hours wait of "travelling to another star".
So I'm not sure about adding it, either.

Please let me know what you think!
Although I'm still open to ideas
(except for adding some kind of "currency"),
but I can't guarantee that I'll implement any.
