title=space 1d 2: more ships
uuid=799d5388-45e1-49ba-b413-b49efd89500b
PROCESSOR=Markdown.pl
intro=Moving forward with a simple game.
tags=space1d
created=2020-05-10
style=iframe {width: 700px; height: 700px; background: white}

It's been a while since I've been in 1-d [space][]. Time to do something!
This time I've introduced a "main game loop" in a form of _Finite State Machine_.
You can see the game as a series of states: first you see an opponent ship in a distance (unless they see you first),
then you meet on a firing distance (unless the ship which saw first, prefers to avoid the meeting),
then player shoots,
then opponent shoots (or surrenders),
then player shoots again (or surrenders),
then winning side takes loser's cargo,
and everything repeats from beginning.

Programmatically, this is implemented as a single function which gets called pretty often, and looks basically like this:

        while(1){
                switch(state){
                        case 'new_ship':
                                // generate enemy ship
                                enemy = randomShip();
                                // check who sees first
                                if(player.radars() > enemy.radars()){
                                        // player sees first
                                        // since we're inside while(1) loop,
                                        // it's enough just to update the
                                        // `state` variable
                                        state = 'player_sees'
                                } else {
                                        state = 'ai_sees'
                                }
                                break;
                        case 'player_sees':
                                // show UI.
                                // UI has buttons which will set new state and
                                // call this function again.
                                render_state(state);
                                return; //exit the loop
                        ...
                }
        }

Although it looks like "spaghetti code", it makes it quite easy to add new states / game features, and that's exactly what's needed, right?

So in current state, the game allows you to:

* decide if to approach enemy ship (unless they see you first - in that case, they decide)

* decide if to attack, surrender, or ignore

* take cargo if they surrender.

Plus, AI can do the same.

Currently AI is very limited (dumb), but that will be improved in the future.

Also, you can't obtain replacements for damaged components, which is discouraging.

Next step is to improve above two points and maybe add some trading?

[space]: space-1d-1-combat.html

<iframe src="space-1d-2-more-ships.htm"></iframe>

