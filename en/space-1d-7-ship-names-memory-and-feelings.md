title=space 1d 7: Ship names, memory, and feelings
intro=Ships are now vindictive and base their decisions (attack or trade) based on previous player behavior
tags=space1d
created=2021-02-21
styles=img
style=iframe {width: 700px; height: 700px; background: white}

In this update, instead of generating a new random ship for every encounter, the game keeps a list of them and picks a random one for every encounter.
Ship names were taken from [donjon SciFi Name Generator][g].
Apart from name, each ship keeps track of player "rating" - how good player was towards this particular ship, and AI bases its decisions on this value.
For example, if a ship offered player to trade, but player attacked instead - next time same ship meets player, it's more likely to attack than to offer to trade.

[g]: https://donjon.bin.sh/scifi/name/#type=sx;sx=spaceship

Your rating decreases when you attack ships, especially after they offered you to trade - it's called treason.
Your rating increases when you offer and accept trade.
There is also a concept of _revenge_: when ship hates you (rating<0), and it attacks you - it starts hating you less, especially if it wins.
Worth mentioning a concept of _impoliteness_: when ship likes you (rating>0) and offers you a trade - it's _impolite_ to click "ignore" button.
You should at least have a look at their offer - otherwise your rating goes down until it hits 0 ("neutral").

However, _impoliteness_ conflicts with concept of "smashing spacebar key like crazy to progress through the game".
Hence, a concept of "_skip_" was introduced.
It works on two screens:
when player sees the opponent ship first and default option is to avoid the contact, and
when AI sees player first and offers to trade - in this case default option is to ignore them.
In both of these cases, if player presses default button within 800ms,
game assumes that player wasn't paying attention and just wanted to progress as fast as possible,
so friendly ships don't see it as offense, and it doesn't affect game story.
Note that two other encounter options - when AI ship sees player first and avoids contact or attacks - don't have a "skip" option.
In first case player doesn't know what ship was that, so it doesn't count as "encounter" anyway;
in second case it's counted as real fight anyway, no matter if player noticed it or not.

Encounter screens show ship's attitude towards player and a brief overview of previous encounter.
I believe it makes the player more "attached" to the game.

Stats board shows you breakdown of ships by their attitude towards you,
and average rating across all ships, called "karma".
Note that while rating as a number doesn't have any limits
(if you keep attacking a ship over and over again - it will be hating you more and more),
words do, so you won't see a rating description stronger than "Love (or hate) you _very much_".

In case you manage to decrease your karma (average feeling of all ships towards you) to less than minus one - you get a chance to meet a "paint shop".
It's an idea taken from GTA series of games, where you can repaint you car and make cops stop recognising you,
efficiently turning you from a wanted criminal to a law-abinding citizen in their eyes.
For a modest price of number of cargo items equal to number of your ship components
(i.e. if your ship has 20 components, you must pay 20 cargo items)
you can reset your karma (your rating among other ships, both good and bad) and your ship name at the same time!
By the way, did you know that the name of your ship from the very beginning was literally "_Your Ship_"?!

<iframe src="space-1d-7-ship-names-memory-and-feelings.htm"></iframe>

Also, trying to better comprehend the game states, I made a state diagram in [plantuml][p].
The [final version][f] turned out to be pretty clear.

[p]: https://plantuml.com/
[f]: http://www.plantuml.com/plantuml/uml/RLHDZ-Cs3BthLx2-zAF8ODfJ4GJ15YWAx6KFtHww60m6d9Y9YJYM836J2GRzxqjRKMH1FjbyfAJt7Ybz2e9UpgVUTDmIqCd95LeAEyzEs0x6FFto3Aij37Hv2HqxatvW3PkTFJdq16yS-9LxbkisvrUwolLu9VyIY4APG8wW2O92yphuk67Dds-MsmOmWEE4_UknfOZ9lKu4TyS8OYuat7KH5Bp3dm-3zPHWJiU_msP3GxlTcZcJDJJVx1dq7n16wW_mMQ2r58OVPOAlzjoKI-0fqdc6fuchVYSTp_Eow0tMaDGGc_-JIyZ9eLevOcqHIcqbye93AAvoACAf6hD3o4dg1XbQsd5B8SDJTx4CfGndalxcGoVmaGNkH-357ZE2ayXGJCeo6CxUAqVo8Q-kiFrTIMOXesNmCO-KGX7cLLEyLlywki851m6ny7g-mdyfXKCBWVf-70_urYJuwI_2NkVXYuLs_3Ffe3Ny-Xju51uECsnpicy4E_G7UpjqSYyLLD3xVMq1gaY7i8PLEYA6HUyKqIMbNHdCFJ5EPbpXx4RfZufM6yfjdX7rF_EP9LXtunYy6sCGbtP6XEZqTFq0dVDMXvP2p8p-uk7WAGH-e_xQA5nSmQz9phF1AAUSdnATgpSenT5ZemE8ZJgQcAxlUhmzUjgaCruid1kG4se0yks9QRdL9sMAyslJQ3mUOe-w7yTbQfMJoQlVwouWfh7STJQGSlPDX9SjSHBbbvvak3R5oKJvYnNWGKYD5sgdCnBJ-7_lgkhNqKjSDQw73sLn_52M1b1HdiqojFOoHFanOps48xifWfjXimtc7ULGPWvst50iH1-Q8hjiuAoYzh7ELdRcrqqzQV64X_IMJHItHK7iR0p7oV-XATAB17C1LBDV99VlG8HgZiYHNrsG6ric8u5yOfMi-cygFaiFH5KKEGWUAQItiwg1LR_QxdKo1Yi4VkmHs7syayrN7Py6EdIEXW2NZWQZPiEkPxLTEjAdNiGEngC67lOO17wwi7Gyc3yU7q_XvmVu9vBa07g2KKCyOQ0MU02jKs8QFHWbC-R9c4BvydYN9JeCgZ0ARCeSJD8-QN0-zTy1
[d]: space-1d-7-decisions.svg
[m]: space-1d-7-decisions-mess.svg

[![State diagram][d]][d]

Starting from the top, you can see that when a new ship comes close to the player, first ship _visibility_ is compared.
Basically, game decides which ship noticed the other ship first:
bigger ships are easier to notice, ships with more radars can notice other ships from a bigger distance.

Then, based on this, execution goes to one of two big boxes: "player\_sees" or "ai\_sees".
These boxes are very similar:
first one side gets a choice: attack, trade, or avoid contact;
then another side makes a choice based on the first side's choice.

If any of the sides chooses to avoid or ignore the other side
- there will be no contact and game moves on to another ship.
If both sides choose trade - execution goes to "trade" box.
You see there are two arrows leading to the "trade" box: one from "player\_sees" and another from "ai\_sees" box.
All other arrows go to different states of the "fight" box.

If we look at the "fight" box - we will see that it's basically player and ai ships shoot at each other
("player\_attacks" and "ai\_attacks" states) until one of them surrenders.

You can notice that there are no arrows going from outside of the "fight" box to the "ai\_attacks" state.
Instead, there is an extra "ai\_fight\_ok" state.
This means that player always has a first shot.
For example, if we look at two lines going down from the "ai\_sees" box to the "fight" box,
we can see that when player decides to attack - arrow goes directly to the "player\_attacks" state which says "damage ai ship",
but when AI decides to attack - arrow goes to the "ai\_fight\_ok" state.
That's somewhat dishonest towards AI players :)

If you think that diagram was too complex to comprehend, just have a look at the same one without boxes!

[![State diagram mess][m]][m]

Okay, here I must give credit to [plantuml][p] which shuffled states around, but still.
It's a mess!
