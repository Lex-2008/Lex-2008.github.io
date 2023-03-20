var grid=[];
var hintTarget=null;

function setupHints(star,canvas,hintTargetObj){
	var max_size=canvas.width;
	var center=(star.size-1)/2;
	grid=seq(star.size).map(x=>[]);
	for(x=Math.floor(center);x<=Math.ceil(center);x++){
		for(y=Math.floor(center);y<=Math.ceil(center);y++){
			grid[x][y]=star;
		}
	}
	for(var planet of star.planets){
		grid[Math.floor(planet.x)][Math.floor(planet.y)]=planet;
	}
	canvas.onmousemove=hint;
	hintTarget=hintTargetObj;
	canvas.onmouseleave=function(){hintTarget.innerText='Hover an object on the map to see what it is'};
}

function hint(event){
	var max_size=event.target.width;
	var cell_size=max_size/star.size;
	var cell_x=Math.floor(event.offsetX/cell_size);
	var cell_y=Math.floor(event.offsetY/cell_size);
	if(!grid[cell_x] || !grid[cell_x][cell_y]){
		hintTarget.innerText="Space void";
		return;
	}
	var obj=grid[cell_x][cell_y];
	if(obj instanceof Planet){
		var radius=planet_size;
	} else {
		var radius=cell_size/2;
	}
	var dist=Math.hypot(event.offsetX-obj.x*cell_size, event.offsetY-obj.y*cell_size);
	if(dist<radius){
		hintTarget.innerHTML=grid[cell_x][cell_y].getText().join('<br>');
	} else {
		hintTarget.innerText="Space void";
	}
}
