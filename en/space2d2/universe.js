// Universe is just one star with its neighbours
var default_universe='{"v":1,"s":{"c":"Yellow","s":4,"n":[-134,-71,-18,34,110,177],"p":[[2.5,0.5,3],[1.5,3.5,0],[3.5,2.5,5]],"v":false},"n":[{"c":"LightGreen","s":5,"n":[-145,-80,-8,46,99,151],"p":[[4.5,2.5,2],[1.5,0.5,9],[3.5,3.5,7],[2.5,1.5,12],[0.5,4.5,11]],"v":0},{"c":"LightGray","s":5,"n":[-128,-77,-27,46,109,172],"p":[[2.5,4.5,1],[3.5,2.5,9],[1.5,1.5,10],[0.5,3.5,15],[4.5,0.5,0]],"v":false},{"c":"Peru","s":5,"n":[-134,-79,-52,-9,34,98,162],"p":[[1.5,2.5,9],[4.5,1.5,6],[2.5,4.5,2],[3.5,0.5,0],[0.5,3.5,12]],"v":false},{"c":"Bisque","s":5,"n":[-146,-82,-19,9,52,94,169],"p":[[3.5,1.5,4],[1.5,3.5,9],[2.5,4.5,14],[0.5,2.5,2],[4.5,0.5,10]],"v":false},{"c":"LightBlue","s":6,"n":[-137,-70,-11,41,92,156],"p":[[1.5,3.5,13],[4.5,5.5,4],[5.5,2.5,6],[3.5,0.5,15],[2.5,4.5,3],[0.5,1.5,0]],"v":false},{"c":"LightSeaGreen","s":5,"n":[-144,-81,-3,43,88,154],"p":[[4.5,2.5,13],[3.5,4.5,14],[1.5,0.5,7],[2.5,3.5,11],[0.5,1.5,3]],"v":1}],"f":{"x":-0.25,"y":1.882,"c":null},"st":{"p":0,"s":0,"jf":0,"js":0}}';

// function task(){
// 	var a=0.5, b=1; //coords of home planet
// 	var r=0.25; // radius of planet/orbit height
// 	var x0=1.5, y0=3.5; // coords of dest planet
// 	console.log(`solve (x1-${a})^2+(y1-${b})^2=${r}^2, (${x0}-x1)*(x1-${a})+(${y0}-y1)*(y1-${b})=0 for x1,y1`)
// 	// x1≈0.277504 ∧ y1≈1.114
// }

function measureAngle(x,a,b){
	return x.neighbours.directionOf(a).angleTo(x.neighbours.directionOf(b));
}

// move player from one star to the new one
function moveToNewStar(star,oldStar){
	// 1. create new systems
	var newStars=[];
	for(var connection of star.neighbours){
		if(!connection.target){
			var newStar=new Star();
			star.link(newStar, connection);
			newStars.push(newStar);
		}
	}
	// 2. connect systems to existing neighbours
	// console.log(star.neighbours,oldStar);
	var commonNeighbour=star.neighbours.left(oldStar).target;
	var newNeighbour=star.neighbours.left(commonNeighbour).target;
	var connectionToUse=commonNeighbour.neighbours.right(star);
	commonNeighbour.link(newNeighbour,connectionToUse);
	//2.5
	var a=commonNeighbour.neighbours.angleBetween(
		commonNeighbour.neighbours.right(newNeighbour),
		newNeighbour);
	var newValue=randomInt(100-a,Math.min(160-a,80));
	console.log(`setting new angle to ${newValue} to have triangle ${a} - ${newValue} - ${180-a-newValue}`);
	newDirection=new Direction(newNeighbour.neighbours.directionOf(commonNeighbour).add(newValue), newNeighbour);
	newNeighbour.neighbours.add(newDirection);
	// console.log(`reused existing connection from ${commonNeighbour.name} to link to ${newNeighbour.name}`);
	// console.log(`got angles: ${measureAngle(star,commonNeighbour,newNeighbour)}, ${measureAngle(commonNeighbour,newNeighbour,star)}, ${measureAngle(newNeighbour,star,commonNeighbour)}`);
	// console.log('connecting',commonNeighbour.name,newNeighbour.name);
	// 2.
	var commonNeighbour=star.neighbours.right(oldStar).target;
	var newNeighbour=star.neighbours.right(commonNeighbour).target;
	var connectionToUse=commonNeighbour.neighbours.left(star);
	commonNeighbour.link(newNeighbour,connectionToUse);
	// 2.5
	var a=commonNeighbour.neighbours.angleBetween(
		newNeighbour,
		commonNeighbour.neighbours.left(newNeighbour));
	// console.log('random number between',100-a,Math.min(160-a,80));
	var newValue=randomInt(100-a,Math.min(160-a,80));
	console.log(`setting new angle to ${newValue} to have triangle ${a} - ${newValue} - ${180-a-newValue}`);
	newDirection=new Direction(newNeighbour.neighbours.directionOf(commonNeighbour).add(-newValue), newNeighbour);
	newNeighbour.neighbours.add(newDirection);
	// console.log(`reused existing connection from ${commonNeighbour.name} to link to ${newNeighbour.name}`);
	// console.log(`got angles: ${measureAngle(star,newNeighbour,commonNeighbour)}, ${measureAngle(commonNeighbour,star,newNeighbour)}, ${measureAngle(newNeighbour,commonNeighbour,star)}`);
	// console.log('connecting',commonNeighbour.name,newNeighbour.name);
	// 3. link new systems to each other
	for(var leftStar of newStars){
		var leftDirection = star.neighbours.directionOf(leftStar);
		var rightDirection = star.neighbours.right(leftDirection);
		var rightStar = rightDirection.target;
		if(newStars.indexOf(rightStar)<0) continue;
		// if(star.neighbours.left(rightStar).target!=leftStar) [leftStar, rightStar] = [rightStar, leftStar];
		if(star.neighbours.left(rightStar).target!=leftStar) console.error('e0',leftStar,rightStar);
		if(leftDirection.target!=leftStar) console.error('e1',leftDirection,leftStar);
		var bisect = leftDirection.add(Math.round(leftDirection.angleTo(rightDirection)/2));
		// var bisect = (leftDirection.value+rightDirection.value)/2;
		// if(leftDirection.value >90 && rightDirection.value<90) bisect+=180;
		console.log(`linking ${leftStar.name} and ${rightStar.name}`);
		// console.log(`bisect of ${leftDirection.value} and ${rightDirection.value} is ${bisect} (shold be ${(leftDirection.value+rightDirection.value)/2})`);
		leftStar.link(rightStar, bisect-90);
		// console.log(`check: ${leftStar.neighbours.directionOf(rightStar).value} and ${rightStar.neighbours.directionOf(leftStar).value}`);
		// 3.5
		var a=randomInt(20,80);
		var b=randomInt(100-a,Math.min(160-a,80));
		if(180-a-b<20||180-a-b>80) console.error('e3',a,b);
		var newDirection=new Direction(leftStar.neighbours.directionOf(rightStar).add(a), leftStar);
		leftStar.neighbours.add(newDirection);
		var newDirection=new Direction(rightStar.neighbours.directionOf(leftStar).add(-b), rightStar);
		rightStar.neighbours.add(newDirection);
	}
	// 4. add new (empty) connections
	for(var newStar of newStars){
		var fromDirection=newStar.neighbours.next(newStar.neighbours.next(star));
		var toDirection=newStar.neighbours.prev(newStar.neighbours.prev(star));
		var degreesToSplit=fromDirection.positiveAngleTo(toDirection);
		// if(degreesToSplit<180) console.error('e2',newStar);
		// var minValue=randomInt(50,80);
		// var maxValue=degreesToSplit-randomInt(50,80);
		// console.log(`splitting for ${newStar.name}`, newStar.neighbours);
		// console.log(`filling between ${fromDirection.target.name} (${fromDirection.value}) and ${toDirection.target.name} (${toDirection.value})`);
		// console.log(`splitting ${degreesToSplit} from ${minValue} (${fromDirection.add(minValue)}) to ${maxValue} (${fromDirection.add(maxValue)})`);
		var lastAdded=0;
		for(var newValue=randomInt(20,80); newValue<degreesToSplit-20; newValue+=randomInt(20,80)){
			console.log(`got ${newValue} will be ${fromDirection.add(newValue)}`);
			// without second argument, 'link' adds direction without a target
			// newStar.neighbours.link(fromDirection.add(newValue));
			var newDirection=new Direction(fromDirection.add(newValue), newStar);
			newStar.neighbours.add(newDirection);
			lastAdded=newValue;
		}
		console.log(`loop done with ${(degreesToSplit-lastAdded)} gap`);
		if(degreesToSplit-lastAdded>80){
			newValue=randomInt(lastAdded+20,degreesToSplit-20);
			console.log(`adding ${newValue} (will be ${fromDirection.add(newValue)}) to fill the gap`);
			newDirection=new Direction(fromDirection.add(newValue), newStar);
			newStar.neighbours.add(newDirection);
		}
		// console.log(`also ${newValue} will be ${fromDirection.add(newValue)}`);
		// fromDirection=new Direction(fromDirection.add(newValue), newStar);
		// newStar.neighbours.add(fromDirection);
		// console.log(`adding last ${maxValue} will be ${fromDirection.add(maxValue)}`);
		// newDirection=new Direction(fromDirection.add(maxValue), newStar);
		// newStar.neighbours.add(newDirection);
		// newStar.makePlanets();
	}
	//*
	// 5. clean up
	var keepNeighbours=[star,star.neighbours.left(oldStar).target,star.neighbours.right(oldStar).target];
	for(var oldConnection of oldStar.neighbours){
		if(keepNeighbours.indexOf(oldConnection.target)<0){
			oldConnection.target=null;
		}
	}
	star.neighbours.left(oldStar).target.neighbours.left(oldStar).target=null;
	star.neighbours.right(oldStar).target.neighbours.right(oldStar).target=null;
	//*/
}

stats={};

function saveUniverse(){
	return {
		v:1,
		s:player_star.save(),
		n:Array.from(player_star.neighbours).map(n=>n.target.save()),
		f:{x:flightplan.steps[0].x,
		   y:flightplan.steps[0].y,
		   c:flightplan.steps[0].cargo},
		st:stats,
	}
}

function loadUniverse(data){
	if(data.v!=1) return;
	player_star=new Star(data.s);
	var newStars=[];
	for(var i=0; i<data.n.length; i++){
		var newStar=new Star(data.n[i]);
		newStars.push(newStar);
		player_star.link(newStar, data.s.n[i]);
	}
	// link neighbours to each other
	for(var leftStar of newStars){
		var rightStar = player_star.neighbours.right(leftStar).target;
		leftStar.neighbours.left(player_star).target=rightStar;
		rightStar.neighbours.right(player_star).target=leftStar;
	}
	flightplan.init(data.f.x,data.f.y,data.f.c,document.getElementById('myFlightplan'));
	stats=data.st;
}

function check(){
	var ok=true;
	for(var c of player_star.neighbours){
		if(Direction.normalize(c.value+180)!=c.target.neighbours.directionOf(player_star).value){
			console.error('player_star and ... dont point to each other', c.target.name,
				Direction.normalize(c.value+180),c.target.neighbours.directionOf(player_star).value
			);
			ok=false;
		}
		if(player_star.neighbours.left(c).target!=c.target.neighbours.right(player_star).target){
			console.error('left (as seen from player_star) and right from ... dont match', c.target.name)
			ok=false;
		}
		if(player_star.neighbours.right(c).target!=c.target.neighbours.left(player_star).target){
			console.error('right (as seen from player_star) and left from ... dont match', c.target.name);
			ok=false;
		}
		var dirToNextNeighbour=c.target.neighbours.next(player_star);
		var nextNeighbour=dirToNextNeighbour.target;
		if(nextNeighbour.neighbours.directionOf(c.target).value!=Direction.normalize(dirToNextNeighbour.value+180)){
			console.error('neighbours dont point to each other', c.target.name, nextNeighbour.name,
				nextNeighbour.neighbours.directionOf(c.target).value,Direction.normalize(dirToNextNeighbour.value+180));
			ok=false;
		}
		if(measureAngle(c.target,c.target.neighbours.prev(nextNeighbour),nextNeighbour)+
		   measureAngle(nextNeighbour,c.target,nextNeighbour.neighbours.next(c.target))<100){
			console.error('future common neighbour of two neighbours will have bad angle', c.target.name, nextNeighbour.name,
				180 - measureAngle(c.target,c.target.neighbours.prev(nextNeighbour),nextNeighbour)-
				      measureAngle(nextNeighbour,c.target,nextNeighbour.neighbours.next(c.target)));
			ok=false;
		}
		var badAngles=Array.from(c.target.neighbours).map((x)=>x.angleTo(c.target.neighbours.next(x))).filter(x=>Math.abs(x)<20||Math.abs(x)>80);
		if(badAngles.length){
			console.error('neighbour has bad angles',c.target.name,badAngles);
			ok=false;
		}
		// if(!ok) return ok;
	}
	var badAngles=Array.from(player_star.neighbours).map((x)=>x.angleTo(player_star.neighbours.next(x))).filter(x=>Math.abs(x)<20||Math.abs(x)>80);
	if(badAngles.length){
		console.error('player_star has bad angles');
		ok=false;
	}
	return ok;
}
