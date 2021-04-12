function Wallet(){
	this.data = new Map();
	this.get= function(country){
		return this.data.get(country) || 0;
	}
	this.add=function add(amount,country){
		this.data.set(country,this.get(country) + amount);
		// consol.log('money+=',amount,this.get(country));
	}
}

function Company(){
	this.wallet = new Wallet();
	timeline.add(this);
	this.step = function() {
		this.wallet.data.forEach((amount,country) => country.bids.placeBids(this,amount));
	};
}

