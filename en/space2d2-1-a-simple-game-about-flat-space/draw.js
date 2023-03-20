planet_size=0;
planet_size=0;

function draw_planet(ctx,planet){
	planet_size=cell_size/5;
	const x=planet.x*cell_size;
	const y=planet.y*cell_size;
	var grd = ctx.createRadialGradient(x-1, y-1, 2, x, y, planet_size);
	grd.addColorStop(0, planet.color_in);
	grd.addColorStop(1, planet.color_out);
	ctx.fillStyle = grd;
	ctx.beginPath();
	ctx.arc(x, y, planet_size, 0, 6);
	ctx.fill();
}

function draw_star(ctx,star){
	var max_size=ctx.canvas.width;
	cell_size=max_size/star.size;
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
}
