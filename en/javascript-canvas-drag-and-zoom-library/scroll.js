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

	canvas.addEventListener('mousewheel', (event)=>{
		this.redraw(true);
		var mousex = event.clientX - this.canvas.offsetLeft;
		var mousey = event.clientY - this.canvas.offsetTop;
		var wheel = event.wheelDelta/120;//n or -n
		var zoom = 1 + wheel/2;
		this.ctx.translate(this.originx, this.originy);
		this.ctx.scale(zoom,zoom);
		this.ctx.translate(
			-( mousex / this.scale + this.originx - mousex / ( this.scale * zoom ) ),
			-( mousey / this.scale + this.originy - mousey / ( this.scale * zoom ) )
		);
		this.originx = ( mousex / this.scale + this.originx - mousex / ( this.scale * zoom ) );
		this.originy = ( mousey / this.scale + this.originy - mousey / ( this.scale * zoom ) );
		this.scale *= zoom;
		this.redraw();
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
		//~ force_draw(true);
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

