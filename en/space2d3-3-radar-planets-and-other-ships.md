title=space2d3 3: radar, planets, and other ships
intro=Now your ship can have a "radar" component, where you can look at a star system
tags=space2d3
style= fieldset { border-color: ButtonBorder } .component>div { display: none; } .notransition { transition: none !important; }
styles=
created=2023-12-30
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Note that it's not exactly the same star system where your ship is,
since you won't find your own ship there!
The star and planets code is taken [from space2d2][f] game.
Also, AI ships are pretty dumb and simply "imitate furious activity" by travelling semi-randomly from one planet to another.
You might also notice that time flies only when you're looking at the radar :)

[f]: http://alexey.shpakovsky.ru/en/space2d2-1-a-simple-game-about-flat-space.html

<div>
	<style id="currentComponent"></style>
	<div style="display: flex;">
		<fieldset style="width: 154px;">
			<legend>Your Ship</legend>
			<!-- <div style="text-align: center;">
				<button id="save">Save Ship</button>
				<button id="load">Load Ship</button>
				<button id="random">Generate Random</button>
			</div> -->
			<div id="canvasBox" style="position: relative; display:flex; align-items: center; justify-content: center; width: 200px; height: 200px; overflow: hidden; background: black; border: 2px groove ButtonBorder;">
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
				<div id="Airlock">Lets you get from one ship to another. You can also <button id="Airlock_Detach">Detach</button> your ship from theirs. </div>
				<div id="Radar">Here you can see a star system:<br><canvas width="296" height="296" style="background: black; border: 2px groove ButtonBorder;"></canvas>
				</div>
			</fieldset>
		</div>
	</div>
	<script src="space2d3-3-radar-planets-and-other-ships.js"></script>
</div>
