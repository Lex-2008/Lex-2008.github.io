// vim: set sw=4 ts=4 expandtab:
class Wallet {
	data = new Map(); // country => amount
	get(country) {
		return this.data.get(country) || 0;
	};
	add(amount, country) {
		this.data.set(country, this.get(country) + amount);
		// consol.log('money+=',amount,this.get(country));
	};
}

class Company {
	constructor() {
		this.wallet = new Wallet();
		timeline.add(this);
	};
	placeAllBids() {
		this.wallet.data.forEach((amount, country) => country.bids.placeBids(this, amount));
	};
	step() {
		this.placeAllBids();
	};
}

class PlayerCompany extends Company {
    autobid = 'no'; // 'no', 'max' or 'payback'
    autobidPaybackValue = 0;
	constructor() {
		super();
	};
	step() {
		// does nothing; this is managed by Player class
	};
    listBids() {
        // called by UI to render list of available bids,
        // and by the function below at the end of players turn
        var bids = [...this.wallet.data.entries()].map(a => {
            var country = a[0];
            var hasMoney = a[1];
            return country.bids.getBids(hasMoney);
        }).flat(1);
        bids.forEach(bid => {
            var myMoney = this.wallet.get(bid.planet.owner);
            if(!bid.player_action){
                // add new player_action based on this.autobid setting
                switch (this.autobid) {
                    case 'no':
                        bid.player_action={place:false, amount:myMoney, max: true};
                        break;
                    case 'max':
                        bid.player_action={place:true, amount:myMoney, max: true};
                        break;
                    case 'payback':
                        var desiredAmount = bid.expectedIncome * this.autobidPaybackValue;
                        if(bid.min > desiredAmount) {
                            // not interested in this bid - min bid is over what we're relady to place
                            bid.player_action={place:false, amount:myMoney, max: false};
                        } else if(desiredAmount > myMoney){
                            // we don't have that much money - bet all we can
                            bid.player_action={place:true, amount:myMoney, max: true};
                        } else {
                            // we have more money than we desire to spend - spend only what we desire
                            bid.player_action={place:true, amount:desiredAmount, max: false};
                        }
                        break;
                }
            } else {
                // update existing player_action
                if(bid.player_action.amount > myMoney) {
                    // player_action.amount can't be bigger than current player's money
                    // (this gets triggered when player money decreases during their turn)
                    bid.player_action.amount = myMoney;
                }
                if(bid.player_action.max){
                    // bids set as "max" should always bet all player's money
                    // (this gets triggered when player money increases during their turn)
                    bid.player_action.amount = myMoney;
                }
            }
        });
        return bids;
    };
    applyBids(){
        this.listBids().forEach(bid => {
            if(!bid.player_action.place) return;
			if (bid.player_action.amount > bid.max) {
				// beat it!
				bid.min = bid.max;
				bid.max = bid.player_action.amount;
				bid.company = this;
				// console.log('bid taken',bid);
			} else {
				// be nasty - make the winner pay more
				bid.min = bid.player_action.amount;
			}
        });
    }

}
