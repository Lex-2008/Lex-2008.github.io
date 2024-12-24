title=space2d3 4: Flying from planet to planet
uuid=f7a00100-1e03-4063-a6d1-d0f4074b5f29
intro=Now you can participate in "useless activity" together with outher ships
tags=space2d3
style= fieldset { border-color: ButtonBorder } .component>div { display: none; } .notransition { transition: none !important; }
styles=
created=2024-01-01
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

When looking at radar, your ship is surrounded by circles.
Number of circles equals to number of radars your ship has,
and you see _some_ ships - each **Cloak** device other ship has _negates_ one **Radar** device on your ship,
so they will be able to come closer until you see them.

You might also notice a bug that even though the base has a radar, too,
it still uses your ship radars to find other ships!
This will be fixed later: each individual radar will have power of only a single radar,
and to make use of multiple radars you'll have to use a Radar Computer.
Or maybe there will be a way to upgrade radars?

As a bonus, the game also has a calendar.
One in-game day takes one second of real time.
Game starts on 1st of January, year 3000.
Happy new year!

<div>
	<style id="currentComponent"></style>
	<div style="height:500px;display: flex;">
		<fieldset style="width: 154px;">
			<legend><span id="now-date"></span> (day <span id="now-day"></span>)</legend>
			<!-- <div style="text-align: center;">
				<button id="save">Save Ship</button>
				<button id="load">Load Ship</button>
				<button id="random">Generate Random</button>
			</div> -->
			<div id="canvasBox" style="position: relative; display:flex; align-items: center; justify-content: center; width: 200px; height: 100%; overflow: hidden; background: black; border: 2px groove ButtonBorder;">
				<canvas id="myCanvas" style="position: absolute; transition: all 0.166s cubic-bezier(0,.5,.8,.8) 0s; transition-property: top,left;"></canvas>
				<span id="human" style="font-family:sans;transition: transform 0.166s linear 0s;">A</span>
			</div>
		</fieldset>
		<div>
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
				<div id="NavigationComputer">
					<style>
						#NavigationComputer>div {
							display: none
						}
					</style>
					<style id="NavigationComputer_css"></style>
					<div id="NavigationComputer_Flying"> Sorry, you can't change your trip in the middle of the journey - for now, at least! </div>
					<div id="NavigationComputer_Select">Select a planet to travel to: <table></table>
						<button id="NavigationComputer_Fly">Depart there</button>
						<button id="NavigationComputer_Plot">Plan course there</button>
					</div>
					<div id="NavigationComputer_Detach"> You have planned a trip. Now go to Airlock to detach from this base and start the trip! </div>
					<div id="NavigationComputer_Departed"> You've started your journey! </div>
				</div>
				<div id="Cloak">Makes your ship harder to detect and scan</div>
			</fieldset>
		</div>
	</div>
	<script src="space2d3-4-flying-from-planet-to-planet.js"></script>
</div>
