planet_size=0;
cell_size=0;
portal_size=0;

// flag: if portals has are located outside of "planet area" (1)
// or same row/column as top-/bottom-/left-/right-most planets (0)
portals_ext=0;

// extra space to reserve for portals
portal_pad=0.5;

function draw_planet(ctx,planet){
	const x=(planet.x+1*portals_ext+portal_pad)*cell_size;
	const y=(planet.y+1*portals_ext+portal_pad)*cell_size;
	var grd = ctx.createRadialGradient(x-1, y-1, 2, x, y, planet_size);
	grd.addColorStop(0, planet.color_in);
	grd.addColorStop(1, planet.color_out);
	ctx.fillStyle = grd;
	ctx.beginPath();
	ctx.arc(x, y, planet_size, 0, 6);
	ctx.fill();
}

function draw_portal(ctx,neighbour,star){
	var x=(neighbour.x)*cell_size;
	var y=(neighbour.y)*cell_size;

	// console.log(neighbour,x,y);

	ctx.strokeStyle = 'purple';
	if(neighbour.target) ctx.strokeStyle='violet';
	ctx.lineWidth = 3;
	var perimeter=Math.PI*portal_size;
	var dashes_count=Math.round(perimeter/3);
	var dashes_length=perimeter/dashes_count;
	ctx.setLineDash([dashes_length, dashes_length]);
	ctx.beginPath();
	ctx.arc(x, y, portal_size, 0, 7);
	ctx.stroke(); 
}

function draw_star(ctx,star){
	var max_size=ctx.canvas.width;
	cell_size=max_size/(star.size+2*portals_ext+2*portal_pad);
	planet_size=cell_size/5;
	portal_size=portal_pad*cell_size/5;
	var center=max_size/2;
	if(star.bright){
		var grd = ctx.createRadialGradient(center, center, 0, center, center, cell_size/2);
		grd.addColorStop(0, "white");
		grd.addColorStop(0.5, star.color);
		grd.addColorStop(1, "black");
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, max_size, max_size);
	} else {
		var grd = ctx.createRadialGradient(center, center, 10, center, center, cell_size/2);
		grd.addColorStop(0, star.color);
		grd.addColorStop(1, "black");
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, max_size, max_size);
	}
	for(var planet of star.planets){
		draw_planet(ctx,planet,cell_size);
	}
	for(var neighbour of star.neighbours){
		draw_portal(ctx,neighbour,star);
	}
}
