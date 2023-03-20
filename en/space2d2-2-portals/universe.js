// Universe is just one star with its neighbours

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
	// NOTE: this is broken if "commonNeighbour" doesn't have empty connetions
	var commonNeighbour=star.neighbours.left(oldStar).target;
	var newNeighbour=star.neighbours.left(commonNeighbour).target;
	var connectionToUse=commonNeighbour.neighbours.right(star);
	commonNeighbour.link(newNeighbour,connectionToUse);
	console.log('connecting',commonNeighbour.name,newNeighbour.name);
	var commonNeighbour=star.neighbours.right(oldStar).target;
	var newNeighbour=star.neighbours.right(commonNeighbour).target;
	var connectionToUse=commonNeighbour.neighbours.left(star);
	commonNeighbour.link(newNeighbour,connectionToUse);
	console.log('connecting',commonNeighbour.name,newNeighbour.name);
	// 3. link new systems to each other
	for(var i=0; i<newStars.length-1; i++){
		var leftStar = newStars[i];
		var rightStar = newStars[i+1];
		if(star.neighbours.left(rightStar).target!=leftStar) [leftStar, rightStar] = [rightStar, leftStar];
		if(star.neighbours.left(rightStar).target!=leftStar) console.error('e0');
		var leftDirection = star.neighbours.directionOf(leftStar);
		var rightDirection = star.neighbours.directionOf(rightStar);
		if(leftDirection.target!=leftStar) console.error('e1');
		if(rightDirection.target!=rightStar) console.error('e2');
		var bisect = leftDirection.add(Math.round(leftDirection.angleTo(rightDirection)/2));
		// var bisect = (leftDirection.value+rightDirection.value)/2;
		// if(leftDirection.value >90 && rightDirection.value<90) bisect+=180;
		leftStar.link(rightStar, bisect-90);
	}
	// 4. add new (empty) connections
	for(var newStar of newStars){
		var fromDirection=newStar.neighbours.next(star);
		var toDirection=newStar.neighbours.prev(star);
		// while(fromDirection.angleTo(toDirection)>=100)
		for(var _n=0;_n<10;_n++){
			if(fromDirection.positiveAngleTo(toDirection)>=100) {
				var newValue=randomInt(20,80);
			} else {
				var newValue=randomInt(20,60);
			}
			// without second argument, 'link' adds direction without a target
			// newStar.neighbours.link(fromDirection.add(newValue));
			fromDirection=new Direction(fromDirection.add(newValue), newStar);
			newStar.neighbours.add(fromDirection);
			if(fromDirection.positiveAngleTo(toDirection)<80) break;
		}
		// newStar.makePlanets();
	}
	// 5. clean up
	var keepNeighbours=[star,star.neighbours.left(oldStar).target,star.neighbours.right(oldStar).target];
	for(var oldConnection of oldStar.neighbours){
		if(keepNeighbours.indexOf(oldConnection.target)<0){
			oldConnection.target=null;
		}
	}
	star.neighbours.left(oldStar).target.neighbours.left(oldStar).target=null;
	star.neighbours.right(oldStar).target.neighbours.right(oldStar).target=null;
}
