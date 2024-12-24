title=space2d3 5: Trading stuff
uuid=fcb689de-a6b9-40cf-8cf1-a4c9d2a04dc8
intro=Ok, it's actually barter, but now you have a reason to travel.
tags=space2d3
style= fieldset { border-color: ButtonBorder } .component>div { display: none; } .notransition { transition: none !important; } .hideChildDiv>div { display: none }
styles=
created=2024-01-04
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Bases (and occasionally your ship, too) now have Trading Computer component,
which let you trade when you're docked to a station.

Sometimes you don't have the resource that your current planet wants -
in that case you might want to try visiting another planet.
Navigation Computer
(helpfully installed on every station, and sometimes on your own ship, too)
helpfully shows you which resource each planet wants and which one it offers in exchange.
To see what cargo you have, you'll have to explore your own ship
(yes, walk)
and check each Cargo Bay individually.

When you have more than one unit of resource that the current planet is interested in -
you can select how many you want to sell them.
And then you might notice that after some value the planet start giving you more than 1 unit of resource per each unit that you offer them!

If you happen to find two planets, where first one offers you resource A in exchange to resource B,
and another one - vise versa - then you can have a nice business running between these two planets!
But only until you run out of free cargo space.
Oh well.

Note that your ship, its cargo and components, and the whole star system are regenerated randomly each time you reload this page,
so if you can't find a good trading opportunity -
you can simply reload the page and hopefully new one will be better!

<div>
	<style id="currentComponent"></style>
	<style id="currentComponentPage"></style>
	<div style="height:500px;display: flex;">
		<fieldset style="width: 154px;">
			<legend>day <span id="now-day"></span> (<span id="now-date"></span>)</legend>
			<div id="canvasBox" style="position: relative; display:flex; align-items: center; justify-content: center; width: 200px; height: 100%; overflow: hidden; background: black; border: 2px groove ButtonBorder;">
				<canvas id="myCanvas" style="position: absolute; transition: all 0.166s cubic-bezier(0,.5,.8,.8) 0s; transition-property: top,left;"></canvas>
				<span id="human" style="font-family:sans;transition: transform 0.166s linear 0s;">A</span>
			</div>
		</fieldset>
		<div style="overflow:scroll">
			<fieldset>
				<legend>Status</legend>
				<div id="status"></div>
			</fieldset>
			<fieldset class="component" style="width: 300px;">
				<legend id="componentLegend"></legend>
				<div id="CargoBay">Space to store come cargo. <div id="CargoBay_NonEmpty">It contains: <ul></ul>
					</div>
					<div id="CargoBay_Empty">It is empty</div>
				</div>
				<div id="Ballast">Extra weight added here to compensate <b></b> component on the other side</div>
				<div id="Passage">Helps you walk around the ship. <br> Hint: use WASD to walk around. If it doesn't work - click here, change keyboard language to English or disable CapsLock</div>
				<div id="Airlock">Lets you get from one ship to another. <div id="Airlock_Locked">You need to have a planned trip before you can undock.</div>
					<div id="Airlock_UnLocked"> You can <button id="Airlock_Detach">Undock</button> to start your trip. </div>
				</div>
				<div id="Radar">Here you can see your current star system: <canvas width="296" height="296" style="background: black; border: 2px groove ButtonBorder;"></canvas>
				</div>
				<div id="Cloak">Makes your ship harder to detect and scan</div>
				<div id="NavigationComputer" class="hideChildDiv">
					<div id="NavigationComputer_Flying"> Sorry, you can't change your trip in the middle of the journey - for now, at least! </div>
					<div id="NavigationComputer_Select">Select a planet to travel to: <table></table>
						<button id="NavigationComputer_Fly">Depart there</button>
						<button id="NavigationComputer_Plot">Plan course there</button>
					</div>
					<div id="NavigationComputer_Detach"> You have planned a trip. Now go to Airlock to detach from this base and start the trip! </div>
					<div id="NavigationComputer_Departed"> You've started your journey! </div>
				</div>
				<div id="TradingComputer" class="hideChildDiv">
					<div id="TradingComputer_None"> None to trade with. </div>
					<div id="TradingComputer_NothingToTradde"> You have nothing to offer this planet</div>
					<div id="TradingComputer_Trade"> Give this planet <b id="TradingComputer_give_number"></b> <span id="TradingComputer_give_type"></span>.<br>
						<input type="range" min="1" id="TradingComputer_give_slider" style="width: 100%;"> You will receive <b id="TradingComputer_get_number"></b> <span id="TradingComputer_get_type"></span>.<br>
						<div id="TradingComputer_max_cargo_warning">Warning: amount of cargo you're getting is limited by amount of your free cargo space</div>
						<button id="TradingComputer_deal">Deal!</button>
					</div>
					<div id="TradingComputer_NoGift"> You don't have enough space to take more cargo</div>
					<div id="TradingComputer_Gift"> This planet offers you <b id="TradingComputer_gift_number"></b> <b id="TradingComputer_gift_type"></b> free of charge.<br>
						<button id="TradingComputer_gift_take">Take it</button>
					</div>
					<div id="TradingComputer_Done">Done! </div>
				</div>
			</fieldset>
		</div>
	</div>
	<script src="space2d3-5-trading-stuff.js"></script>
</div>
