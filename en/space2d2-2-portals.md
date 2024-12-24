title=space2d2 2: Portals
uuid=0cc83d05-7aa3-4dac-80ff-138a77ce1fc3
intro=One star is good, but more stars is better
tags=space2d2
style=
styles=
created=2023-03-15
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

This version introduces portals, as a way to navigate from one star to another.

Idea is that you're located in a single star system,
and can see its neighbours.
You can look at them by clicking highlighted portals.
Dim portals lead to other star systems,
which you can't see.

This is because in "hard" mode
(where you can't cross your path)
your options regarding what star to travel to
depend on what path you take while travelling though a star system,
and what side of map you end up after visiting its planets.
So you are expected to cosider neighbouring stars
when planning you trip through the current system.

As of now, there's no such limitation,
and you can simply use highlighted portals to look around,
pick a star system you like,
and press the <button onclick="jump()">jump</button> button
to move there.

Note how you can "see" previousely unknown stars,
and those which are now too far become unknown!
Also, if they become visible again -
they will be different.
That's because, well, travelling through space takes a lot of time,
and a lot might change during this time...

<![CDATA[>
<div style="text-align:center">
	<canvas id="myCanvas" width="500" height="500"></canvas>
	<div id="hints" style="height:4em">Hover an object on the map to see what it is</div>
</div>

<script src="space2d2-2-portals/utils.js"></script>
<script src="space2d2-2-portals/angle.js"></script>
<script src="space2d2-2-portals/planets.js"></script>
<script src="space2d2-2-portals/stars.js"></script>
<script src="space2d2-2-portals/draw.js"></script>
<script src="space2d2-2-portals/hints.js"></script>
<script src="space2d2-2-portals/universe.js"></script>
<script>
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	var player_star=shown_star=new Star();

	// create new stars around player_star
	var a=randomInt(-179,180);
	var b=a-randomInt(20,80);
	player_star.link(new Star(), a);
	player_star.link(new Star(), b);
	var fromDirection=player_star.neighbours.directionOf(a);
	var toDirection=player_star.neighbours.directionOf(b);
	// while(fromDirection.angleTo(toDirection)>=100)
	for(var _n=0;_n<10;_n++){
		if(fromDirection.positiveAngleTo(toDirection)>=100) {
			var newValue=randomInt(20,80);
		} else {
			var newValue=randomInt(20,60);
		}
		fromDirection=new Direction(fromDirection.add(newValue), player_star);
		// player_star.neighbours.add(fromDirection);
		player_star.link(new Star(), fromDirection.value);
		if(fromDirection.positiveAngleTo(toDirection)<80) break;
	}

	// link new stars to each other
	for(var d of player_star.neighbours){
		var leftStar = d.target;
		var rightStar = player_star.neighbours.right(d).target;
		// console.log(leftStar.name,rightStar.name);
		// if(star.neighbours.left(rightStar).target!=leftStar) [leftStar, rightStar] = [rightStar, leftStar];
		var leftDirection = player_star.neighbours.directionOf(leftStar);
		var rightDirection = player_star.neighbours.directionOf(rightStar);
		// console.log(leftDirection.target.name,rightDirection.target.name);
		if(leftDirection.target!=leftStar) console.error('e1');
		if(rightDirection.target!=rightStar) console.error('e2');
		var bisect = leftDirection.add(Math.round(leftDirection.angleTo(rightDirection)/2));
		// console.log(leftDirection.value,rightDirection.value,bisect);
		leftStar.link(rightStar, bisect-90);
	}

	// add new connections to each of them
	for(var a_connection of player_star.neighbours){
		var a_star=a_connection.target;
		// add new (empty) connections
		var fromDirection=a_star.neighbours.next(player_star);
		var toDirection=a_star.neighbours.prev(player_star);
		// while(fromDirection.angleTo(toDirection)>=100)
		for(var _n=0;_n<10;_n++){
			if(fromDirection.positiveAngleTo(toDirection)>=100) {
				var newValue=randomInt(20,80);
			} else {
				var newValue=randomInt(20,60);
			}
			fromDirection=new Direction(fromDirection.add(newValue), a_star);
			a_star.neighbours.add(fromDirection);
			// a_star.link(new Star(), fromDirection.value);
			if(fromDirection.positiveAngleTo(toDirection)<80) break;
		}
	}

	draw_star(ctx,shown_star);
	setupHints(shown_star,c,document.getElementById('hints'));

function jump(){
	if(player_star==shown_star) return;
	moveToNewStar(shown_star,player_star);
	player_star=shown_star;
	draw_star(ctx,shown_star);
	setupHints(shown_star,c,document.getElementById('hints'));
}
</script>
