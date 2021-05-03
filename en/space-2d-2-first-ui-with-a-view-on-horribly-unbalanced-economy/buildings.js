function Building(kind,owner){
	this.kind = kind;
	this.owner = owner;
}

function Buildings() {
	this.data = [new Map(), new Map(), new Map];
	this.getOwned = function (kind, owner) {
		return this.data[kind].get(owner) || 0;
	}
	this.add = function (kind, owner, count) {
		if(count===undefined) count = 1; // '0' value can be passed as well
		this.set(kind, owner, this.getOwned(kind, owner)+count);
	}
	this.set = function (kind, owner, count) {
		if (!count) {
			this.data[kind].delete(owner);
		} else {
			this.data[kind].set(owner, count);
		}
	}
	this.kindsCount = function () {
		// returns a 3-element array with count of buildings of each kind
		return this.data.map(kind_map=>[...kind_map.values()].reduce((a,v)=>a+v))
	}
	this.assign = function (kind, owner) {
		// assings none-owned buildings to a bid winner
		this.add(kind, owner, this.getOwned(kind))
		this.data[kind].delete();
	}
}