title=space 1d 6: Stats
intro=One step forward, one step back
tags=space1d
created=2021-02-13

I actually didn't like [previous version][5], and found myself playing [the one before that][4] more.
Speaking of which, did you notice that when you switch from one version to another, your ship comes with you?
That's because the "savegame slot" (website's localstorage) is shared between them.

[5]: space-1d-5-costly-approach.html
[4]: space-1d-4-trading-and-bluffing.html

So taking [the pre-previous version][4] as the start, this one serves to refresh my memory of that code and slightly improves it.
For example, when a ship offers you a trade and you attack it - now, instead of shooting the rockets, you do the "aggressive approach" maneuver ("offer to fight" in new terms).
This way, if opponent ship is weaker than yours, you can take its cargo without harming them.
Another improvement is that on cargo delivery, number of rockets and fuel in your reward equals to _half_ of boxes that you delivered, instead of all of them.
This way, you still have place for boxes to perform other deliveries even after taking cargo as a reward.

But biggest change of all is the new "stats" screen/encounter.
It came from my old desire to know how far I traveled (how many "encounters" I had).
Naturally, it's the first stat value :)
Other information collected include
job completeness ratio (how good are you at performing delivery tasks),
fight winning ratio (how good are you at fight),
and other data.
So yeah, now you can say that this website _tracks_ you.
Should I be concerned regarding GDPR? :D

<div>
<style>
iframe {width: 100%; height: 600px; background: white}
</style>
<iframe src="space-1d-6-stats.htm"></iframe>
</div>
