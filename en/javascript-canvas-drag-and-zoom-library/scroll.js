function CanvasDragZoom(canvas, draw, initscale=1){
	this.canvas = canvas;
	this.ctx=canvas.getContext('2d');
	this.draw=draw;
	this.originx=0;
	this.originy=0;
	this.scale=initscale;
	this.dragging=false;
	this.lastdragX=0;
	this.lastdragY=0;
	this.ctx.scale(this.scale,this.scale);
	this.redraw=function(clearonly){
		this.ctx.clearRect(this.originx,this.originy,this.canvas.width/this.scale,this.canvas.height/this.scale);
		if(clearonly) return;
		this.draw({ctx:this.ctx,
			minx:this.originx,
			miny:this.originy,
			width:this.canvas.width/this.scale,
			height:this.canvas.height/this.scale,
			maxx:this.originx+this.canvas.width/this.scale,
			maxy:this.originy+this.canvas.height/this.scale,
			width_px:this.canvas.width, // screen pixels
			height_px:this.canvas.height,
			scale:this.scale // screen_pixels / canvas_units
		});
	};
	this.redraw();

	canvas.addEventListener('wheel', (event)=>{
		event.preventDefault();
	 	this.redraw(true);
		// Get mouse offset.
		const mousex = event.offsetX;
		const mousey = event.offsetY;
		// Normalize mouse wheel movement to +1 or -1 to avoid unusual jumps.
		const wheel = event.deltaY < 0 ? 1 : -1;

		// Compute zoom factor.
		const zoom = 1+wheel/5; //Math.exp(wheel * zoomIntensity);

		// Translate so the visible origin is at the context's origin.
		this.ctx.translate(this.originx, this.originy);

		// Compute the new visible origin. Originally the mouse is at a
		// distance mouse/scale from the corner, we want the point under
		// the mouse to remain in the same place after the zoom, but this
		// is at mouse/new_scale away from the corner. Therefore we need to
		// shift the origin (coordinates of the corner) to account for this.
		this.originx -= mousex/(this.scale*zoom) - mousex/this.scale;
		this.originy -= mousey/(this.scale*zoom) - mousey/this.scale;

		// Scale it (centered around the origin due to the translate above).
		this.ctx.scale(zoom, zoom);
		// Offset the visible origin to it's proper position.
		this.ctx.translate(-this.originx, -this.originy);

		// Update scale and others.
		this.scale *= zoom;
		// visibleWidth = width / scale;
		// visibleHeight = height / scale;
	 	this.redraw();
		console.log(zoom, mousex,mousey, this.originx, this.originy, this.scale);
	});


	canvas.addEventListener('mousedown', (event)=>{
		var mousex = event.clientX - this.canvas.offsetLeft;
		var mousey = event.clientY - this.canvas.offsetTop;
		this.dragging=true;
		this.lastdragX=mousex/this.scale;
		this.lastdragY=mousey/this.scale;
	});

	canvas.addEventListener('mousemove', (event)=>{
		if(!this.dragging) return;
		var mousex = event.clientX - this.canvas.offsetLeft;
		var mousey = event.clientY - this.canvas.offsetTop;
		var newX=mousex/this.scale;
		var newY=mousey/this.scale;
		this.ctx.translate(newX-this.lastdragX,newY-this.lastdragY);
		this.originx-=newX-this.lastdragX;
		this.originy-=newY-this.lastdragY;
		this.lastdragX=newX;
		this.lastdragY=newY;
		this.redraw();
	});

	canvas.addEventListener('mouseup', (event)=>{
		this.dragging=false;
	});
}

