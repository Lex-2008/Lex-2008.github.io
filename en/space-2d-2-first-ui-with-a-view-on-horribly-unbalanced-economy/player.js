// vim: set sw=4 ts=4 expandtab:
class Ship {
    onPlanet;
    store=[0,0,0];
    maxCargo=0;
    constructor(onPlanet) {
        this.onPlanet = onPlanet;
        this.store = [0, 0, 9];// players are gifted with 9 robots by default
        this.maxCargo = 10;
    };
    getFreeCargo() {
        return this.maxCargo - this.store.reduce((a,v)=>a+v);
    };
    buy(kind, amount, player) {
        //NOTE: "amount" is signed: positive means transfer from planet to ship, negative - otherwise
        //"player" is needed for money transfer
        if(amount > 0) {
            // duplicate of UI.renderShipNeighbour
            amount=Math.min(amount, this.onPlanet.store[kind], this.getFreeCargo(),
            Math.floor(player.company.wallet.get(this.onPlanet.owner) / this.onPlanet.prices[kind]));
        } else {
            amount=-Math.min(-amount, this.store[kind]);
        }
        this.onPlanet.store[kind] -= amount;
        this.store[kind] += amount;
        player.company.wallet.add(-this.onPlanet.prices[kind] * amount, this.onPlanet.owner);
    }
}
class Player{
    company;
    country;
    ship;
    lvl=0; //0: has no buildings, 1: has buildings
    isPlayer=true; //flag for timeline.loopUntilPlayer
    wantBids=false; //flag that this player sleeps until bids
    constructor(onPlanet) {
        this.company = new PlayerCompany();
        this.country = new Country();
        this.ship = new Ship(onPlanet);
		timeline.add(this);
    };

    step() {
        // this is called by timeline - at the beginning of player's turn
        var attention=false;
        // duplicate of PlayerCompany.listBids
        if(this.lvl==0) {
            if (this.company.autobid == 0) {
                var bids = [...this.wallet.data.entries()].map(a => {
                    var country = a[0];
                    var hasMoney = a[1];
                    return country.bids.getBids(hasMoney);
                }).flat(1);
                attention = bids.length>0;
            } else {
                attention = getPlayerBuildings(this).length>0;
            }
        }
        ui.currentPlayer = this;
        ui.attention = attention;
        ui.renderCurrentTab();
    };
}
