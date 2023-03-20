// 1. copypaste table from https://www.cssportal.com/css3-color-names/ to vim
// 2. :%s/^\t\([^\t]*\)\t#[^\t]*\t/['\1', /
// 3. :%s/$/],/
// 4. copypaste from vim to JS console, assign to var data=[...]
// 5. use RGBToHSL function from https://css-tricks.com/converting-color-spaces-in-javascript/, modified to return only 'l' as number
// 6. out=data.map(x=>[x[0],RGBToHSL(x[1],x[2],x[3])])
// 7. prompt('',JSON.stringify(out.filter(x=>x[1]>40).map(x=>x[0])))
var starColors=["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkGray","DarkGrey","DarkKhaki","DarkOrange","DarkOrchid","DarkSalmon","DarkSeaGreen","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","Fuchsia","Gainsboro","GhostWhite","Gold","Goldenrod","Gray","GreenYellow","Grey","Honeydew","HotPink","IndianRed","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenrodYellow","LightGray","LightGreen","LightGrey","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","MediumAquamarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MintCream","MistyRose","Moccasin","NavajoWhite","OldLace","Orange","OrangeRed","Orchid","PaleGoldenrod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Red","RosyBrown","RoyalBlue","Salmon","SandyBrown","Seashell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

function Star() {
	// TODO: make sure colors don't repeat
	this.color = randomFrom(starColors);
	this.size=randomInt(5,9);
	this.x = this.y = this.size/2;
	this.bright=false;
	this.name=this.color;
	if(this.size%2==0){
		this.bright=true;
		this.name='bright '+this.name;
	}
	this.planets = makePlanets(this.size); //from planets.js
	this.getText = function (i) {
		return [ this.name + ' star' ];
	}
	this.link = function(other, direction){
		if(direction instanceof Direction){
			direction.target=other;
			other.neighbours.link(this, direction.value+180);
		} else {
			this.neighbours.link(other, direction);
			other.neighbours.link(this, direction+180);
		}
	}
}

/*
stars = {
	list: [],
	squares: {},
	active_square: '',
	add: function (x, y) {
		this.list.push(new Star(x, y));
	},
	triangulate: function () {
		var delaunay = Delaunator.from(this.list, star => star.x, star => star.y);
		var triangles = delaunay.triangles;
		this.list.forEach(star => star.set_neighbours = new Set());
		for (var i = 0; i < triangles.length; i += 3) {
			var p0 = triangles[i];
			var p1 = triangles[i + 1];
			var p2 = triangles[i + 2];
			this.list[p0].set_neighbours.add(this.list[p1]);
			this.list[p0].set_neighbours.add(this.list[p2]);
			this.list[p1].set_neighbours.add(this.list[p0]);
			this.list[p1].set_neighbours.add(this.list[p2]);
			this.list[p2].set_neighbours.add(this.list[p0]);
			this.list[p2].set_neighbours.add(this.list[p1]);
		}
		for (var i = 0; i < this.list.length; i++) {
			this.list[i].neighbours=[...this.list[i].set_neighbours];
		}
	},
	setActiveSquare: function (x0, y0, delta=1) {
		if(this.active_square==x0+':'+y0) return;
		this.active_square=x0+':'+y0;
		// add new ones
		var new_squares={};
		for (x = x0 - delta; x <= x0 + delta; x++) {
			for (y = y0 - delta; y <= y0 + delta; y++) {
				new_squares[x + ':' + y] = 1;
				if (!this.squares[x + ':' + y]) {
					var xx = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
					var yy = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
					for (var i = 0; i < 10; i++) {
						this.add(x * 10 + xx[i] + 0.25 + Math.random()/2,
						         y * 10 + yy[i] + 0.25 + Math.random()/2);
					}
				}
			}
		}
		// delete old ones
		this.squares=new_squares;
		var minx=(x0-delta)*10;
		var miny=(y0-delta)*10;
		var maxx=(x0+delta)*10+10;
		var maxy=(y0+delta)*10+10;
		this.list=this.list.filter(star=>star.x>minx && star.x<maxx && star.y>minx && star.y<maxy);
		this.triangulate();
	},
}
*/
