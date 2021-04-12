function Planet(x, y) {
	this.x = x;
	this.y = y;
	this.owner = null;
	this.war_dist = 0;
	this.neighbours = new Set();
	this.quality = [ //3,2,3];
		randomInt(3, 5), // fuel
		randomInt(2, 4), // ore
		randomInt(3, 7), // robots
	];
	this.prices = [0, 0, 0];
	this.incomes = [0, 0, 0];
	this.buildings = new Buildings();
	this.store = [0, 0, 100];//resources belonging to this planet. Player can buy them, and robots do protect this planet (by default you need 1000 robots to colonise it)
	this.value = this.quality[2] - 2;
	this.colonise = function (player) {
		// used only to randomly spawn enemies
		if (!player) { player = new Country(); }
		this.owner = player;
		this.store[2] = 0;
		this.updateWarDist();
		planets.ensureSquareSurrounded(Math.floor(this.x / 10), Math.floor(this.y / 10));
		var company = new Company();
		for (var i = 0; i < 3; i++) {
			this.buildings.add(i, company);
		}
		timeline.add(this);
		return this.owner;
	};
	this.updateWarDist = function () {
		var list = [...this.neighbours, this];
		var expected_war_dist = 0;
		while (list.length) {
			var planet = list.pop();
			if (!planet.owner) continue;
			if ([...planet.neighbours].some(neighbour => neighbour.owner != planet.owner)) {
				// a neighbour belonging to a different player found => we're at war
				expected_war_dist = 1;
			} else {
				expected_war_dist = Math.min(...[...planet.neighbours].map(neighbour => neighbour.war_dist)) + 1;
			};
			if (planet.war_dist == expected_war_dist) continue;
			planet.war_dist = expected_war_dist;
			list = list.concat([...planet.neighbours]);
		}
	};
	this._supplyDemand = function () {
		var buildings_kinds = this.buildings.kindsCount();
		var supply = buildings_kinds.map((count, kind) => count * this.quality[kind]);
		var demand = [buildings_kinds[1] + buildings_kinds[2], //fuel consumed by mines(1) and factories(2)
		buildings_kinds[2],
		buildings_kinds[0] + buildings_kinds[1]];
		// console.log('supply demand:'+supply+' '+demand);
		return [supply, demand];
	};
	this.getIncomes = function (prices) {
		var incomes = prices.map((price, kind) => price * this.quality[kind]);
		incomes[0] -= prices[2];
		incomes[1] -= prices[0] + prices[2];
		incomes[2] -= prices[0] + prices[1];
		return incomes;
	};
	this.updatePrices = function (supply, demand) {
		var base_price = 2520 / this.war_dist * this.quality[2];
		var base_prices = this.quality.map(quality => base_price / quality);
		if (!supply) {
			[supply, demand] = this._supplyDemand();
		}
		var prices = base_prices.map((price, kind) => price / supply[kind] * demand[kind]);
		for (var i = 0; i < 4; i++) {
			var incomes = this.getIncomes(prices);
			if (!incomes.some(i => i < 1)) break;
			if (i == 3) {
				console.log('bad prices', prices, incomes);
				break;
			}
			// console.log('fixing incomes', incomes, prices);
			incomes.forEach((income, index) => { if (income < 1) { prices[index] -= income + 1 } }); //note: income<0 so this actually increases the price
			// console.log('fixed  incomes', this.getIncomes(prices) ,prices);
		}
		this.prices = prices.map(Math.round);
		this.incomes = this.getIncomes(this.prices);
	};
	this.considerAttack = function (target) {
		var attacking_planets = [...target.neighbours].filter(planet => planet.owner == this.owner);
		var attacking_robots = attacking_planets.map(planet => Math.max(0,Math.min(planet.store[2] - planet.value * 10, planet.store[0])));
		var attacking_robots_sum = attacking_robots.reduce((a, v) => a + v, 0);
		return [attacking_planets, attacking_robots, attacking_robots_sum];
	};
	this.step = function () {
		// finish bids - this ensures all buildings have an owner
		this.owner.bids.closeBids(this);
		// add products to store
		var [supply, demand] = this._supplyDemand();
		var supplyDemand = supply.map((supply, i) => supply - demand[i]);
		this.store = this.store.map((item, index) => item + supplyDemand[index]);
		// give money to companies
		// TODO: maybe rewrite to for() for performance?
		this.buildings.data.forEach((map, kind) => map.forEach((count, owner) =>
			owner.wallet.add(this.incomes[kind] * count, this.owner)
		));
		// update prices
		this.updatePrices(supply, demand);
		this.value = supplyDemand[2];
		// console.log('set value',this.value);
		// consider attack or build
		if (this.war_dist == 1) {
			if (this.store[2] <= this.value * 10) return;
			for (var target of this.neighbours) {
				if (target.owner == this.owner) continue;
				var [attacking_planets, attacking_robots, attacking_robots_sum] = this.considerAttack(target);
				var defender_robots = target.store[2];
				if (attacking_robots_sum < defender_robots + target.value * 10) continue;
				// ok to attack
				// console.log("attacking planet with store: "+target.store, "sending robots: "+attacking_robots);
				target.attacked(this.owner, attacking_planets, attacking_robots, attacking_robots_sum);
			};
			//TODO: lvl2: consider building a factory to speed up robot production
			//TODO: lvl3: build mine if needed for factory
			return;
		}
		// choose a neighbour to send robots to
		var min_war_dist = Math.min(...[...this.neighbours].map(planet => planet.war_dist));
		var neighbours_closest_to_war = [...this.neighbours].filter(planet => planet.war_dist === min_war_dist);
		var min_robot_count = Math.min(...neighbours_closest_to_war.map(planet => planet.store[2]));
		var neighbours_with_min_robots = neighbours_closest_to_war.filter(planet => planet.store[2] === min_robot_count);
		// TODO: spread robots equally instead of picking one winner planet at random
		var receiving_planet = randomFrom(neighbours_with_min_robots);
		var robots_to_send = Math.max(0, Math.floor(Math.min(this.store[0], this.store[2] - this.value * 10) / 2));
		receiving_planet.store[2] += robots_to_send;
		receiving_planet.store[0] += robots_to_send;
		this.store[2] -= robots_to_send;
		this.store[0] -= 2 * robots_to_send;
		if(this.store.some(x=>x<0))
			debugger
		// console.log("sent",robots_to_send);
		var to_build = [0, 0, 0]; // amount of buildings of each type to build
		while (this.store[2] >= this.value * 10 + 100) {
			// decide what building to build
			var building_kind = 0;
			// - aim for: exessive supply of robots = exessive supply of fuel
			if (supplyDemand[2] >= supplyDemand[0]) {
				// - if exessive supply of robots > exessive supply of fuel, then build refinery (it requires robots which we have plenty)
				building_kind = 0;
				// - otherwise, consider building a factory.
			} else if (supplyDemand[0] > 0 && supplyDemand[1] > 0) {
				//   - if have at least 1 exessive ore and fuel - build factory
				building_kind = 2;
				//   - otherwise, build what's needed for factory
			} else if (supplyDemand[0] == 0) {
				building_kind = 0;
			} else {
				building_kind = 1;
			}
			// plan to build
			to_build[building_kind]++;
			this.store[2] -= 100;
			// update supplyDemand for next loop iteration
			supplyDemand[building_kind] += this.quality[building_kind];
			if (building_kind == 0) {
				supplyDemand[2]--;
			} else if (building_kind == 1) {
				supplyDemand[0]--;
				supplyDemand[2]--;
			} else if (building_kind == 2) {
				supplyDemand[0]--;
				supplyDemand[1]--;
			};
		}
		to_build.forEach((count, kind) => {
			if(count == 0) {return}
			this.buildings.add(kind, undefined, count);
			this.owner.bids.add(this, kind, count, this.incomes[building_kind], this.prices[2]);
		});
	};
	this.attacked = function (player, attacking_planets, attacking_robots, attacking_robots_sum) {
		var colonising = !this.owner;
		// close all pending bids
		if (this.owner) this.owner.bids.closeBids(this);
		// note that this is used both when attacking other players and when colonising planets
		this.owner = player;
		// TODO: keep some of attacking robots on their original planets
		attacking_planets.forEach((planet, i) => { planet.store[0] -= attacking_robots[i]; planet.store[2] -= attacking_robots[i] });
		// console.log("attacked, setting robots from",this.store[2],attacking_robots_sum,attacking_robots_sum-this.store[2]);
		this.store[2] = attacking_robots_sum - this.store[2];
		this.updateWarDist();
		if (!colonising) return;
		// console.log("colonising");
		// COLONIZE
		planets.ensureSquareSurrounded(Math.floor(this.x / 10), Math.floor(this.y / 10));
		// add 3 buildings
		for (var i = 0; i < 3; i++) {
			this.buildings.add(i);
		}
		// TODO: do we need incomes? We don't use them anyway!
		this.updatePrices();
		// add bids - should come after updating prices which comes after adding buildings
		for (var i = 0; i < 3; i++) {
			this.owner.bids.add(this, i, 1, this.incomes[i], this.prices[2]);
		}
		timeline.add(this);
	};
	this.getText = function (i) {
		if (this.owner) {
			return [`${i} (${this.war_dist}) - ${this.value}`,
			'Q: ' + this.quality,
			// 'P: '+this.prices,
			'I: ' + this.incomes,
			'S: ' + this.store,
			// 'B: '+this.buildings.map(b=>b.kind),
			'B: ' + this.buildings.kindsCount(),
			];
		} else {
			return [`${i} - ${this.value}`];
		}
	}
}

function shuffle(array) {
	return array.map((a) => ({ sort: Math.random(), value: a }))
		.sort((a, b) => a.sort - b.sort)
		.map((a) => a.value)
}

planets = {
	list: [],
	// lines:[],
	triangles: [],
	squares: {},
	add: function (x, y) {
		this.list.push(new Planet(x, y));
	},
	triangulate: function () {
		var delaunay = Delaunator.from(this.list, planet => planet.x, planet => planet.y);
		var triangles = delaunay.triangles;
		this.triangles = [];
		this.list.forEach(planet => planet.neighbours = new Set());
		for (var i = 0; i < triangles.length; i += 3) {
			var p0 = triangles[i];
			var p1 = triangles[i + 1];
			var p2 = triangles[i + 2];
			this.list[p0].neighbours.add(this.list[p1]);
			this.list[p0].neighbours.add(this.list[p2]);
			this.list[p1].neighbours.add(this.list[p0]);
			this.list[p1].neighbours.add(this.list[p2]);
			this.list[p2].neighbours.add(this.list[p0]);
			this.list[p2].neighbours.add(this.list[p1]);
			this.triangles.push([this.list[p0], this.list[p1], this.list[p2]])
		}
		// TODO: this.loadLines();
	},
	ensureSquareSurrounded: function (x0, y0) {
		if (this.squares[x0 + ':' + y0] == 2) return;
		var updated = false;
		var to_colonise = []; //{index, count}
		for (x = x0 - 1; x <= x0 + 1; x++) {
			for (y = y0 - 1; y <= y0 + 1; y++) {
				if (!this.squares[x + ':' + y]) {
					this.squares[x + ':' + y] = 1;
					var xx = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
					var yy = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
					for (var i = 0; i < 10; i++) {
						this.add(x * 10 + xx[i] + 0.5, y * 10 + yy[i] + 0.5);
					}
					updated = true;
					if (x % 2 == 0 && y % 2 == 0) {
						to_colonise.push({
							index: this.list.length - 1,
							count: (Math.abs(x) + Math.abs(y) >= 0) ? 10 : 0
						});
					}
				}
			}
		}
		this.squares[x0 + ':' + y0] = 2;
		if (updated) {
			this.triangulate();
		};
		return; // no monsters auto-spawn
		if (to_colonise.length) {
			to_colonise.forEach(x => {
				var new_country = planets.list[x.index].colonise();
				if (!x.count) return;
				for (var i = 1; i < x.count; i++) {
					planets.list[x.index - i].colonise(new_country);
				}
			});
		}
	},
}
