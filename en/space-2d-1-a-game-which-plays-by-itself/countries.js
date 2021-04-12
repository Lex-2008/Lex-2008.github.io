function randomInt(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}
function randomFrom(a) {
	return a[Math.floor(Math.random() * a.length)];
}

function randomHex() {
	return Array(6).fill(1).map(x => randomInt(0, 15).toString(16)).join('');
}

function Bids() {
	this.bids = []; //planet,kind,count,expectedIncome,min,max,company
	this.add = function (planet, kind, count, expectedIncome, robotPrice) {
		// called by the planet when it adds a building
		this.bids.push({ planet: planet, kind: kind, count: count, expectedIncome: expectedIncome, min: 0, max: 100 * robotPrice, company: null });
		// console.log('bid added',this.bids[this.bids.length-1]);
	};
	this.placeBids = function (company, hasMoney) {
		// called by company once a month
		// note that by the time this is called, all bids placed by this company previousely should expire, so we're free to spend all money on bids
		this.bids.filter(bid => bid.min < hasMoney).forEach(bid => {
			if (hasMoney > bid.max) {
				// beat it!
				bid.min = bid.max;
				bid.max = hasMoney;
				bid.company = company;
				// console.log('bid taken',bid);
			} else {
				// be nasty - make the winner pay more
				bid.min = hasMoney;
			}
		});
	};
	this.closeBids = function (planet) {
		// called by the planet once a month
		var new_company = null;
		while (true) {
			var idx = this.bids.findIndex(x => x.planet == planet);
			if (idx < 0) return;
			var [bid] = this.bids.splice(idx, 1);
			if (bid.company == null) {
				if (new_company == null) new_company = new Company();
				bid.company = new_company;
			}
			// console.log('bid closed',bid);
			planet.buildings.assign(bid.kind, bid.company);
			bid.company.wallet.add(-bid.min, bid.planet.owner);
		}
	};
}

function Country() {
	this.color = '#' + randomHex();
	this.bids = new Bids();
}
