// vim: set sw=4 ts=4 expandtab:
timeline={
	list:[],
	current:null,
	passed:0,
	add:function(obj){
		// TODO: add after 'last' one?
		// this.list.splice(Math.floor(this.now/this.list.length),0,obj);
		this.list.splice(Math.floor(Math.random()*(this.list.length+1)),0,obj);
	},
	next:function(){
		// note that we can't just store index of most-recently fired element, since indexes might move when adding new item
		var i=this.list.indexOf(this.current); //note that it will be -1 for non-existing element
		i++;
		if(i >= this.list.length){
			this.passed++;
			i=0;
		}
		this.current=this.list[i];
		this.current.step();
	},
	loop:function(n){
		if(!n)n=1;
		for(var i=0;i<this.list.length*n;i++){
			this.next();
		};
	},
	loopUntilPlayer:function(){
		do{
			this.next();
		}while(!this.current.isPlayer);
	}
}
