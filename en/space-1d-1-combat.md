title=space 1d 1: combat
intro=Adding some action to the simple game prototype.
tags=space1d
created=2018-04-02
style=iframe {width: 700px; height: 700px; background: white}

Moving on with the [game I talked previously][game] about, let's add some simple combat.
On the screen below you see your ship, your opponent, and a single action button.

When you click it - ships exchange rockets - number of rockets fired is calculated as minimum of number of rockets and number of guns on the ship, and is subtracted from number of rockets in cargo.

Then ships try to perform evasive maneuvers - their _amount_ is calculated as minimum of number of engine on the ship and number of fuel that it has (fuel is subtracted from cargo - same as with rockets).

_Efficiency_ of evasive maneuvers is calculated as ratio of their amount to total number of components.
For example, a ship consisting of 5 components, 2 of which are engines, having enough fuel (at least two), will have only `(5-2)/5=60%` chance of being hit.

Rockets that reach the ship deal a damage - one component gets destroyed by each rocket, starting from the tail (bottom of the list).
Try imagining how result would look **before** hitting "attack" button! ;)

[game]: space-1d-0-idea.html

<iframe src="space-1d-1-combat.htm"></iframe>

Next step is to add more options beyond "attack" one (surrender, etc), and let opponent ships replace each other.

