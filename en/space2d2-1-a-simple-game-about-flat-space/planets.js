var planetTypes=(function(){
	// key to next variable
	var resources=['water','iron','food','radioactives'];
	var colors=['blue','olive','green','red'];
	var planetNamesTable=[ // table: rows: what planet buys; columns: what planet sells; value: planet name
		[null,'water-mining','farming','burning'],
		['ice',null,'hunting','fire'],
		['fishy','bio-mining',null,'nuclear'],
		['frozen','hot mining','ice-farming',null]];

	var ret=[
		['ocean',null,'water','blue','blue'],
		['dry','water',null,'white','white'],
		['mining',null,'iron','olive','olive'],
		['populated','food',null,'green','green']];

	for(var buy=0; buy<4; buy++){
		for(var sell=0; sell<4; sell++){
			if(buy==sell) continue;
			ret.push([planetNamesTable[buy][sell], resources[buy],resources[sell], colors[buy],colors[sell]])
		}
	}
	return ret;
})();

function Planet(x, y, type) {
	this.x = x;
	this.y = y;
	this.name = type[0];
	this.buys = type[1];
	this.sells = type[2];
	this.color_in = type[3];
	this.color_out = type[4];
	this.getText = function (i) {
		var ret = [ this.name + ' planet' ];
		if(this.buys) ret.push('Buys: ' + this.buys);
		if(this.sells) ret.push('Sells: '+this.sells);
		return ret;
	}
}

function isBad(x,y,size){
	var center=size/2;
	return x<center+0.6 && x>center-0.6 && y<center+0.6 && y>center-0.6;
}

function makePlanets(size) {
	var thisPlanetTypes=shuffle(planetTypes);
	for(_n=0;_n<10;_n++){
		var bad=false;
		var ret=[];
		var xx = shuffle(seq(size));
		var yy = shuffle(seq(size));
		var center=size/2;
		for (var i = 0; i < size; i++) {
			if(isBad(xx[i]+0.5,yy[i]+0.5,size)){
				bad=true;
			}
			ret.push(new Planet(xx[i] + 0.5, yy[i] + 0.5,
			        thisPlanetTypes[i]));
		}
		if(!bad) return ret;
	}
	console.error('should not be here');
}
