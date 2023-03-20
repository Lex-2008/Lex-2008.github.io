// var grid=[];
var hintTarget=null;
var visibleStar;

function setupHints(star,canvas,hintTargetObj){
	visibleStar=star;
	canvas.onmousemove=hint;
	hintTarget=hintTargetObj;
	canvas.onmouseleave=function(){hintTarget.innerText='Hover an object on the map to see what it is'};
	canvas.onclick=click;
}

function hintText(obj){
	if(obj instanceof Direction){
		if(!obj.target) return ['Portal to unknown'];
		var ret=['Portal to '+hintText(obj.target)];
		if(obj.target == player_star) ret=ret.concat(['(you are there)','Click to return']);
		else ret.push('Click to explore');
		return ret;
	} else if(obj instanceof Planet){
		var ret = [ obj.name + ' planet' ];
		if(obj.buys) ret.push('Buys: ' + obj.buys);
		if(obj.sells) ret.push('Sells: '+obj.sells);
		return ret;
	} else if(obj instanceof Star){
		return [ obj.name + ' star' ];
	}
	return ['Unknown object'];
}

function objAt(x,y,max_size){
	var cell_x=Math.floor(x/cell_size-portal_pad);
	var cell_y=Math.floor(y/cell_size-portal_pad);
	// console.log(cell_x,cell_y);
	if(cell_x<0||cell_x>=visibleStar.size||
	   cell_y<0||cell_y>=visibleStar.size){
		// in portal area
		var radius=portal_size/cell_size;
		for(neighbour of visibleStar.neighbours){
			var dist=Math.hypot(x/cell_size-neighbour.x,
			                    y/cell_size-neighbour.y);
			// console.log(dist,radius);
			if(dist<radius){
				// console.log(neighbour.getText().join('<br>'));
				return neighbour;
			}
		}
	}
	if(!visibleStar.grid[cell_x] || !visibleStar.grid[cell_x][cell_y]){
		return null;
	}
	var obj=visibleStar.grid[cell_x][cell_y];
	// console.log(obj);
	if(obj instanceof Planet){
		var radius=planet_size;
	} else {
		var radius=cell_size/2;
	}
	var dist=Math.hypot(event.offsetX-(obj.x+1*portals_ext+portal_pad)*cell_size, event.offsetY-(obj.y+1*portals_ext+portal_pad)*cell_size);
	if(dist<radius){
		return obj;
	}
}

function hint(event){
	const obj=objAt(event.offsetX, event.offsetY, event.target.width);
	hintTarget.innerHTML=obj?hintText(obj).join('<br>'):"Space void";
}

function click(event){
	const obj=objAt(event.offsetX, event.offsetY, event.target.width);
	if(obj instanceof Direction && obj.target){
		shown_star=obj.target;
		draw_star(ctx,shown_star);
		setupHints(shown_star,ctx.canvas,hintTarget);
		hint(event);
	}
}
