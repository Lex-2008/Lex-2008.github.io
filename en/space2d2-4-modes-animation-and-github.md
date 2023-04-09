title=space2d2 4: modes, animation, and github
intro=this game got its own (sub)domain!
tags=space2d2
style=
styles=
created=2023-04-08
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Despite promises in [previous][p] note, I still moved on and added "easy" and "real" modes.
Why? Because I realised that choosing next step over and over again gets tiresome soon,
and artificially limiting game time makes the game more... _interesting_ \[citation needed\].
How is it working? Well, I've been playing it for one week so far,
without missing any time slots
(with 10 hour "travel time" between stars I'm effectively limited to playing it
twice a day: in the morning and in the evening, ±2 hours from usual time).

[p]: space2d2-3-the-finished-game.html

I also decided to translate the game to TypeScript, which is basically "JavaScript with type annotations".
Well, basically to try using it with [VS Code - OSS][vsc] and hoping that it might help me avoid stupid bugs
(like forgetting the order of arguments to a two-argument function)
and maybe refactor the code a bit in the future.

[vsc]: https://github.com/Microsoft/vscode

Also, I finally uploaded in to [github][gh] to track progress and
store some documentation on how to build / install the game.
Because it needs to be compiled from TypeScript to JavaScript,
and a [pocketbase][pb] backend is required to save game in "real" mode.
Because well, storing game progress in browser's localStorage
is all nice, private, and easy, but might get lost as easy
(do you have an option to clear all your cookies on browser restart?
Did you add my site to exceptions?
Are you sure you won't migrate to another browser in a future?).

[gh]: https://github.com/Lex-2008/space2d2
[pb]: https://pocketbase.io/

Also, regarding animations: I've added some of them,
but not sure if I like them or will change them.
We'll see!

Link to the game's current website: <https://space2d2.shpakovsky.ru/>
It is hosted at the [Always Free hosting][af] provided by Oracle Cloud, in Germany.
If it matters, keep this in mind while sharing your personal data with this website.

Note that if you previously played this game on **this** website
(in iframe or on an individual page), then your progress
(for "hard" mode, since it was the only game mode before)
will **not** be transferred to the new site.
That's the drawback of storing data locally in the browser.
If you need it - please ask me - I'll send you instructions
on how to fetch your progress saved for one site and inject it into another.
