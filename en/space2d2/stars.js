// 1. copypaste table from https://www.cssportal.com/css3-color-names/ to vim
// 2. :%s/^\t\([^\t]*\)\t#[^\t]*\t/['\1', /
// 3. :%s/$/],/
// 4. copypaste from vim to JS console, assign to var data=[...]
// 5. use RGBToHSL function from https://css-tricks.com/converting-color-spaces-in-javascript/, modified to return only 'l' as number
// 6. out=data.map(x=>[x[0],RGBToHSL(x[1],x[2],x[3])])
// 7. prompt('',JSON.stringify(out.filter(x=>x[1]>40).map(x=>x[0])))
var starColors=["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkGray","DarkGrey","DarkKhaki","DarkOrange","DarkOrchid","DarkSalmon","DarkSeaGreen","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","Fuchsia","Gainsboro","GhostWhite","Gold","Goldenrod","Gray","GreenYellow","Grey","Honeydew","HotPink","IndianRed","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenrodYellow","LightGray","LightGreen","LightGrey","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","MediumAquamarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MintCream","MistyRose","Moccasin","NavajoWhite","OldLace","Orange","OrangeRed","Orchid","PaleGoldenrod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Red","RosyBrown","RoyalBlue","Salmon","SandyBrown","Seashell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

function mkgrid(star, size){
	var grid=seq(size+2*portals_ext).map(x=>[]);
	var center=(size-1)/2;
	for(var x=Math.floor(center);x<=Math.ceil(center);x++){
		for(var y=Math.floor(center);y<=Math.ceil(center);y++){
			grid[x+1*portals_ext][y+1*portals_ext]=star;
		}
	}
	return grid;
}

function countJobs(planets){
	var data={null:{buys:0,sells:0}};
	resources.forEach(x=>{data[x]={buys:0,sells:0}});
	planets.forEach(planet=>{data[planet.buys].buys++; data[planet.sells].sells++});
	var jobs=0;
	resources.forEach(x=>{jobs+=Math.min(data[x].buys,data[x].sells)});
	return jobs;
}

function Star(load) {
	if(!load){
		load={
			c:randomFrom(starColors),
			s:randomInt(5,9),
			n:false,
			p:false,
			v:false,
		}

	}
	// TODO: make sure colors don't repeat
	this.color = load.c;
	this.size=load.s;
	this.visited=load.v;
	this.x = this.y = this.size/2;
	this.bright=false;
	this.name=this.color;
	if(this.size%2==0){
		this.bright=true;
		this.name='bright '+this.name;
	}
	this.neighbours = new Directions(this);
	if(load.n){
		for(value of load.n){
			this.neighbours.add(new Direction(value, this));
		}
	}
	this.grid=mkgrid(this, this.size);
	if(!load.p) load.p=makePlanets(this.size, this.grid); //from planets.js
	this.planets = load.p.map(x=>new Planet(...x));
	for(var planet of this.planets){
		this.grid[Math.floor(planet.x)+1*portals_ext][Math.floor(planet.y)+1*portals_ext]=planet;
	}
	this.jobs=countJobs(this.planets);

	this.link = function(other, direction){
		if(direction instanceof Direction){
			direction.target=other;
			other.neighbours.link( direction.value+180,this);
		} else {
			this.neighbours.link( direction,other);
			other.neighbours.link( direction+180,this);
		}
	}

	this.save=function(){
		return {
			c:this.color,
			s:this.size,
			n:Array.from(this.neighbours).map(x=>x.value),
			p:this.planets.map(x=>x.save()),
			v:this.visited,
		};
	}
}

