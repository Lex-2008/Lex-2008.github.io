title=space 1d 5: Costly approach
uuid=f5409d31-6e2d-4fdd-98a2-bf22d45a3920
PROCESSOR=Markdown.pl
intro=Changes in physics
tags=space1d links
created=2020-05-21
style=iframe {width: 100%; height: 700px; background: white}

A new type of component (and cargo) added: Defense Grid (which uses Defense Ammo).
Engines and fuel are now used for different purpose: now they are used for approach.

But first, defense: mathematcis got simpler: one defense grid destroys one incoming rocket.
So if your ship has more defense grids than opponent ship has guns - you won't lose any component.
Which is easier to estimate by AI, but makes the game a bit less _fun_.

Moreover, approach and avoid commands cost some fuel - so now AI attacks less frequently, and player tends to be more conservative, too.
You're less likely to "approach aggressively" a smaller empty ship just for fun.

Space docks now accept only fuel,
and a new random encounter added - a space dump - which converts any component to Cargo Bay (and destroys cargo bay),
and any cargo - to fuel.

This way it's much easirt to build "a spaceship of your dreams", which raises a question: _now what_?
Probably, we should start _colonising_ some asteroids, but that gets out of "1d-space" idea... into 2d, at least :)
Note to self: it's possible to do with [Poisson disk sampling][1] or [Perlin/Simplex noise][2].
Second approach is heavier on calculations, but doesn't require storing position of each point in savegames.

[1]: http://devmag.org.za/2009/05/03/poisson-disk-sampling/
[2]: https://www.redblobgames.com/maps/terrain-from-noise/#trees

Due to above changes, currently there is no trading and ability to use engines to avoid rockets - these features are likely to return in future updates.

<iframe src="space-1d-5-costly-approach.htm"></iframe>
