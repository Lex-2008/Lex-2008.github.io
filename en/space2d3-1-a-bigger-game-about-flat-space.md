title=space2d3 1: a bigger game about flat space
uuid=0abbfc21-5579-48fc-b8cd-c10aadab5fe1
intro=Idea it to make a mix of space1d and space2d2 games (I'm not very good at naming things)
tags=space2d3
style= fieldset { border-color: ButtonBorder }
styles=
created=2023-12-25
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

You will be able to travel from planet to planet, buy and sell stuff (or, rather, exchange / barter things) - like in [space2d2][] game,
but also have components and fight other ships - like in [space1d][] game!

[space2d2]: http://alexey.shpakovsky.ru/en/#tag:space2d2
[space1d]: http://alexey.shpakovsky.ru/en/#tag:space1d

Biggest change will be probably ability to have a two-dimensional ship.
But basically it's just several vertical "rows" of components,
connected together by a single bridge called "passage".

Below you can have a look at some random ships,
also save and load them to your localStorage.
Each cell has coordinates, like `A1`,
and can be either Cargo Bay (`C`),
or a Ballast (`B`).
Ballast is added automatically to counter-weight components on the other side of the ship
(that's why ships look symmetrical and nice).

<div>
	<fieldset>
		<legend>Your Ship</legend>
		<div>
			<button id="save">Save Ship</button>
			<button id="random">Generate Random Ship</button>
			<button id="load">Load Ship</button>
		</div>
		<canvas id="myCanvas" width="500" height="500" style="background:black;border:2px groove ButtonBorder;"></canvas>
	</fieldset>
	<script src="space2d3-1-a-bigger-game-about-flat-space.js"></script>
<div>
