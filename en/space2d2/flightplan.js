var flightplan={
	steps:[],
	// visited:[],
	element:null,
	init:function(x,y,cargo,element){
		this.element=element;
		this.steps=[{
			start:true,
			planet:{x:x,y:y},
			x:x,y:y,
			buy:false,
			sell:false,
			cargo:cargo,
		}];
	},
	add:function(planet){
		const oldIndex = flightplan.steps.findIndex(x=>x.planet==planet);
		// if(oldIndex == flightplan.steps.length-1) this.undo();
		if(oldIndex>=0) return;
		// if(this.visited.indexOf(planet)>-1) return;
		// this.visited.push(planet);
		var cargo=this.steps.at(-1).cargo;
		this.steps.push({
			planet:planet,
			x:planet.x,
			y:planet.y,
			buy:false,
			sell:false,
			cargo:cargo,
		});
		this.updateStep(this.steps.length-1);
	},
	undo:function(){
		// don't remove first element - it's an initial state - how player arrived to this system
		if(this.steps.length<=1) return;
		this.steps.pop();
	},
	canSell:function(i){
		return this.steps[i].planet.buys && this.steps[i-1].cargo == this.steps[i].planet.buys;
	},
	setSell:function(i,value,dontUpdate){
		if(value && !this.canSell(i)) return;
		var step=this.steps[i];
		step.sell=value;
		if(!dontUpdate) this.updateStep(i,true,true);
	},
	canBuy:function(i){
		return this.steps[i].planet.sells && (!this.steps[i-1].cargo || this.steps[i].sell);
	},
	setBuy:function(i,value,dontUpdate){
		if(value && !this.canBuy(i)) return;
		var step=this.steps[i];
		step.buy=value;
		if(!dontUpdate) this.updateStep(i,true);
	},
	updateStep:function(i,changed,noAutoSell){
		// RECURSIVE
		if(i>=this.steps.length) return;
		// console.log('updateStep',i,changed);
		var step=this.steps[i];
		if(noAutoSell) {
			// only disables sale if it's impossible
			if(step.sell && !this.canSell(i)){
				step.sell=false;
				changed = true;
			}
		} else {
			// set sell to its possible value
			if(step.sell != this.canSell(i)){
				step.sell=this.canSell(i);
				changed = true;
			}
		}
		if(step.buy && !this.canBuy(i)){
			step.buy = false;
			changed = true;
		}
		var new_cargo=step.buy?step.planet.sells:step.sell?null:this.steps[i-1].cargo;
		changed = changed || step.cargo!=new_cargo;
		step.cargo=new_cargo;
		if(changed){
			this.updateStep(i+1);
		}
	},
	countJobs:function(){
		// count all "sell" actions
		return this.steps.reduce((a,step)=>a+=step.sell, 0);
	},
	canPathTo:function(obj){
		for(var i=1;i<this.steps.length-1;i++){
			if(intersect(this.steps[i-1].planet, this.steps[i].planet,
				this.steps.at(-1).planet, obj))
				return false;
		}
		return true;
	},
	pathToCollidesWith:function(obj){
		if(lineCrossesObj(this.steps.at(-1).planet,obj,player_star, 0.5)) return 'star';
		var size=planet_size/cell_size;
		// console.log(obj,this.steps.at(-1).planet);
		for(var planet of player_star.planets){
			if(planet!=obj && planet!=this.steps.at(-1).planet &&
				lineCrossesObj(this.steps.at(-1).planet,obj,planet, size)) return planet.name+' planet';
		}
	},
	cantTravelTo:function(planet){
		if(flightplan.steps.findIndex(x=>x.planet==planet)>=0) return 'planet already in flight plan';
		if(!this.canPathTo(planet)) return 'crosses existing path';
		var name=this.pathToCollidesWith(planet);
		if(name) return 'path crosses '+name;
		return false;
	},
	cantJumpTo:function(star,direction){
		if(star == player_star) return "you're currently at this star";
		if(star.visited) return "you've already been here";
		if(!this.canPathTo(direction)) return "path to portal crosses existing path";
		var name=this.pathToCollidesWith(direction);
		if(name) return 'path crosses '+name;
		return false;
	},
}

function redrawFlightplan(){
	var html=flightplan.steps.map((step,i)=>{
		var ret=[];
		if(step.start){
			ret.push(`Arrived to <b>${player_star.name} star</b>`+(step.cargo?` with ${step.cargo}`:''));
		} else {
			ret.push(`<div><b>${i}: ${step.planet.name} planet</b>`);
			if(step.planet.buys) ret.push(`<label><input type="checkbox" ${step.sell?'checked':''} ${flightplan.canSell(i)?'':'disabled'} onchange="flightplan.setSell(${i},this.checked);redrawFlightplan()"> Sell ${step.planet.buys}</label>`);
			if(step.planet.sells) ret.push(`<label><input type="checkbox" ${step.buy?'checked':''} ${flightplan.canBuy(i)?'':'disabled'} onchange="flightplan.setBuy(${i},this.checked);redrawFlightplan()"> Buy ${step.planet.sells}</label>`);
			ret.push(`</div>`);
			if(step.cargo) ret.push(`Travel with ${step.cargo}`);
			else ret.push(`Travel empty`);
		}
		return ret.join(' ');
	}).join(' ');
	flightplan.element.innerHTML=html;
	document.getElementById('fp_undo').style.display=flightplan.steps.length<=1?'none':'';
	document.getElementById('fp_hint').style.display=(shown_star==player_star)?'':'none';

	document.getElementById('fp_jobs_done').innerText=flightplan.countJobs();
	document.getElementById('fp_jobs_total').innerText=player_star.jobs;
	// document.getElementById('fp_jobs_prc').innerText=Math.round(flightplan.countJobs()/player_star.jobs*100);

	document.getElementById('fp_jump').style.display=(shown_star==player_star)?'none':'';
	if(shown_star!=player_star){
		var reason=flightplan.cantJumpTo(shown_star, player_star.neighbours.directionOf(shown_star));
		document.getElementById('fp_jump_ok').style.display=reason?'none':'';
		document.getElementById('fp_jump_ok_star').innerText=shown_star.name+' star';
		document.getElementById('fp_jump_ok_jobs').innerText=shown_star.jobs;
		document.getElementById('fp_jump_no').style.display=reason?'':'none';
		document.getElementById('fp_jump_no_reason').innerText=reason;
	}
}
