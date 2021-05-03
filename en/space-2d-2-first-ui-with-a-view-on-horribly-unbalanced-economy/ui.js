// vim: set sw=4 ts=4 expandtab:
gebi = (id) => document.getElementById(id);
$ = (selector) => document.querySelector(selector);
$$ = (selector) => document.querySelectorAll(selector);

// returns array of {planet:planet, count:int} objects
function getPlayerBuildings(player) {
    return planets.list.filter(a=>a.owner).map(
        planet => [0, 1, 2].map(
            kind => {
                return {
                    planet: planet,
                    kind: kind,
                    count: planet.buildings.getOwned(kind, player.company)
                };
            })).flat(1).filter(a=>a.count);
}

// // returns bids that player _can_ take, not necessary they _should_
// // returns array of bids, where each bid is an object with these keys:
// // planet,kind,count,expectedIncome,min,max,company
// function getPlayerBids(player) {
//     return [...player.company.wallet.data.entries()].map(a => {
//         var country = a[0];
//         var hasMoney = a[1];
//         return country.bids.getBids(hasMoney);
//     }).flat(1);
// }

// returns minimum amount of money you need to have in order to place a bid,
// or 0 if this country has no open bids.
function getMinBid(country) {
    if (country.bids.bids.length === 0)
        return 0;
    return country.bids.bids.map(bid => bid.min).reduce((a,v)=>Math.min(a,v));
}

function printMoney(amount, country) {
    // TODO: shadow if too bright color
    return `<span style="color: ${country.color}" tooltip="${country.name} ${country.currency}">${amount} ${country.currency}</span>`;
}

class UI {
    // NOTE: this must be exposed as top-level 'ui' object
    currentTab = 'ship'; //ship, company, or country
    paused = false;
    currentPlayer = null;
    currentPlanet = null;
    attention = false;
    shipNeighbourPlanets;
    shipSelectedNeighbour;
    bids = []; // array of bids:
        // planet,kind,count,expectedIncome,min,max,company
    // currentPlayerCompanyBuildings;
    showSection(section) {
        $('#main_frame').className=section;
    }
    renderCurrentTab() {
        switch(this.currentTab){
            case 'ship' : this.renderShipTab(); break;
            case 'company' : this.renderCompanyTab(); break;
            case 'country' : this.renderCountryTab(); break;
        }
        gebi('companyLink').style.fontWeight=this.attention ? 'bold' :'';
        cdg.redraw();
    }
    renderShipTab() {
        this.currentTab = 'ship';
        this.showSection('shipTab');
        this.currentPlanet = this.currentPlayer.ship.onPlanet;
        gebi('shipMaxCargo').innerText = this.currentPlayer.ship.maxCargo;
        gebi('shipCurrentPlanet').innerText = this.currentPlanet.name;
        gebi('shipMoney').innerHTML = printMoney(this.currentPlayer.company.wallet.get(this.currentPlanet.owner), this.currentPlanet.owner);
        [0,1,2].forEach(kind=>{
            gebi('ship'+kind+'Cost').innerText = this.currentPlanet.prices[kind];
            gebi('ship'+kind+'Your').innerText = this.currentPlayer.ship.store[kind];
            gebi('ship'+kind+'Planet').innerText = this.currentPlanet.store[kind];
            gebi('shipBuy'+kind+'Amount').max = Math.max(this.currentPlayer.ship.store[kind], this.currentPlanet.store[kind]);
        });
        this.shipNeighbourPlanets = [...this.currentPlanet.neighbours].filter(planet=>planet.owner);
        gebi('shipNeighbour').innerHTML = this.shipNeighbourPlanets.map((planet, index) =>
            `<option value="${index}">${planet.name}</option>`
        ).join(' ');
        var i=this.shipNeighbourPlanets.indexOf(this.shipSelectedNeighbour);
        if (i<0) i=0;
        this.renderShipNeighbour(i);
    }
    shipIncreaseCargo() {
        if (this.currentPlayer.ship.store[2] != this.currentPlayer.ship.maxCargo) {
            alert('You need to own ' + this.currentPlayer.ship.maxCargo + ' robots for this');
            return;
        }
        this.currentPlayer.ship.store[2] = 0;
        this.currentPlayer.ship.maxCargo++;
        this.renderShipTab();
    };
    // direction: 1: buy, -1: sell
    shipBuy(direction, kind) {
        var amount = gebi('shipBuy'+kind+'Amount').valueAsNumber;
        this.currentPlayer.ship.buy(kind,direction*amount,this.currentPlayer);
        gebi('shipMoney').innerHTML = printMoney(this.currentPlayer.company.wallet.get(this.currentPlanet.owner), this.currentPlanet.owner);
        gebi('ship'+kind+'Your').innerText = this.currentPlayer.ship.store[kind];
        gebi('ship'+kind+'Planet').innerText = this.currentPlanet.store[kind];
        gebi('shipBuy'+kind+'Amount').max = Math.max(this.currentPlayer.ship.store[kind], this.currentPlanet.store[kind]);
    };
    renderShipNeighbour(i){
        this.shipSelectedNeighbour = this.shipNeighbourPlanets[i];
        [0,1,2].forEach(kind=>{
            gebi('ship'+kind+'NeighbourPrice').innerHTML = printMoney(this.shipSelectedNeighbour.prices[kind], this.shipSelectedNeighbour.owner);
            // profit - if we transport what we can: min(this_planet_storage, our_ship_storage, player_money)
            // duplicate of Ship.buy
            var amount=//this.currentPlayer.ship.store[kind] +
                Math.min(this.currentPlanet.store[kind], this.currentPlayer.ship.maxCargo,
                Math.floor(this.currentPlayer.company.wallet.get(this.currentPlanet.owner) / this.currentPlanet.prices[kind]));
            var income=this.shipSelectedNeighbour.prices[kind]*amount;
            var cost=this.currentPlanet.prices[kind]*amount;
            if(this.currentPlanet.owner == this.shipSelectedNeighbour.owner){
                gebi('ship'+kind+'NeighbourProfit1').innerHTML = printMoney(this.shipSelectedNeighbour.prices[kind] - this.currentPlanet.prices[kind], this.shipSelectedNeighbour.owner);
                gebi('ship'+kind+'NeighbourProfitMax').innerHTML = printMoney(income - cost, this.shipSelectedNeighbour.owner);
            } else {
                gebi('ship'+kind+'NeighbourProfit1').innerHTML = printMoney(this.shipSelectedNeighbour.prices[kind], this.shipSelectedNeighbour.owner) + ' - ' + printMoney(this.currentPlanet.prices[kind], this.currentPlanet.owner);
                gebi('ship'+kind+'NeighbourProfitMax').innerHTML = printMoney(income, this.shipSelectedNeighbour.owner) + ' - ' + printMoney(cost, this.currentPlanet.owner);
            }
        });
    }

    renderCompanyTab() {
        this.currentTab = 'company';
        var buildings = getPlayerBuildings(this.currentPlayer);
        this.bids = this.currentPlayer.company.listBids();
        if (this.currentPlayer.wantBids && this.bids.length === 0) {
            setTimeout(()=>ui.turn(), 100);
        } else {
            this.currentPlayer.wantBids=false;
        }
        if (buildings.length === 0 && this.bids.length === 0) {
            var minBid = getMinBid(this.currentPlayer.ship.onPlanet.owner);
            if (minBid === 0) {
                this.showSection('companyNoBidsTab');
                return;
            }
            this.showSection('companyNoMoneyTab');
			// TODO: <b id="companyNoMoneyAmount"></b> <span id="companyNoMoneyCurrency"></span>
            return;
        }
        this.showSection('companyTab');
        this.currentPlayer.lvl = 1;

        gebi('companyMoney').innerHTML = [...this.currentPlayer.company.wallet.data.entries()].map(a => {
            var country = a[0];
            var amount = a[1];
            return printMoney(amount, country)
        }).join(', ');
        gebi('companyNegativeMoney').style.display = [...this.currentPlayer.company.wallet.data.values()].some(a=>a<0)?'':'none';
        
        gebi('companyHasBuildings').style.display = buildings.length?'': 'none';
        gebi('companyNoBuildings').style.display = buildings.length?'none': '';
        gebi('companyBuildings').innerHTML = buildings.map(building =>
            `<tr><td>${building.planet.name}</td>
            <td>${['Fuel Refinery','Ore Mine','Robot Factory'][building.kind]}</td>
            <td>${building.count}</td>
            <td>${printMoney(building.planet.incomes[building.kind], building.planet.owner)}</td>
            </tr>`).join('');

        gebi('companyAutobids_'+this.currentPlayer.company.autobid).checked = true;
        gebi('companyAutobids_paybackValue').value = this.currentPlayer.company.autobidPaybackValue;

        // Because: on "ship" screen, player can attack new planets/builds buildings,
        // this adds/removes available bids
        gebi('companyHasBids').style.display = this.bids.length?'': 'none';
        gebi('companyNoBids').style.display = this.bids.length?'none': '';
        gebi('companyBids').innerHTML = this.bids.map((bid, index) =>
            `<tr>
            <td colspan="4">
            ${['Fuel Refinery','Ore Mine','Robot Factory'][bid.kind]}
            at ${bid.planet.name}
            x${bid.count}
            </td>
            </tr><tr>
            <td>${bid.expectedIncome}</td>
            <td>${bid.min}</td>
            <td>${bid.max}</td>
            <td>
                <label><input type="checkbox" ${bid.player_action.place ? 'checked' : ''}
                    oninput="ui.bids[${index}].player_action.place=this.checked"> bid </label>
                <label><input type="number" value="${bid.player_action.amount}"
                    oninput="ui.bids[${index}].player_action.amount=this.value"
                    min="${bid.min}" max="${this.currentPlayer.company.wallet.get(bid.planet.owner)}">
                ${printMoney('',bid.planet.owner)}</label>
                <label> max <input type="checkbox" ${bid.player_action.max ? 'checked' : ''}
                    oninput="ui.bids[${index}].player_action.max=this.checked;ui.bids[${index}].player_action.amount=ui.currentPlayer.company.wallet.get(ui.bids[${index}].planet.owner)"></label>
            </td>
            </tr>`).join('');
    }
    renderCountryTab() { }
    shipTravel() {
        this.currentPlayer.ship.onPlanet = this.shipSelectedNeighbour;
        this.turn();
    }

    turn() {
        this.currentPlayer.company.applyBids();
        timeline.loopUntilPlayer();
    };
    turnUntilBids() { };
}

// class GameManager {
//
//     currentPlayer = null;
//
//     startTurn(player) {
//         this.currentPlayer = player;
//     }
//
//     clickTab(tabName) {
//         if (!paused) { return };
//         switch (tabName) {
//             case 'ship':
//                 break;
//             case 'company':
//                 break;
//             case 'country':
//                 break;
//         }
//     };
//
//     shipIncreaseCargo() { };
//
//     turn() { };
// }
