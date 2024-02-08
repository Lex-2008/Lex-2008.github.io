title=space2d3 2: walking and (de)taching
intro=Now you can walk on your ship... And others, too
tags=space2d3
style= fieldset { border-color: ButtonBorder } .component>div { display: none; } .notransition { transition: none !important; }
styles=
created=2023-12-26
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

The window where you can see your ship became smaller,
so now you have to **walk** around it
in order to see the whole picture.
To do this, use `WASD` keys (I'm assuming you're using desktop computer, not a mobile phone).
If they don't work - focus the webpage, check your keyboard language and state of CapsLock key.

Also, now you can check what's in those cargo containers all over your ship.
Moreover, you can dock to other ships, and explore _their_ containers, too!
To undock from a ship, use "Undock" button available when you're in Airlock.
You'll be automatically docked to a new random ship in 5 seconds.

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
			<div id="canvasBox" style="width: 200px; height: 200px; overflow: hidden; background: black; border: 2px groove ButtonBorder;">
				<canvas id="myCanvas" style="position: relative; transition: all 0.166s cubic-bezier(0,.5,.8,.8) 0s; transition-property: top,left;"></canvas>
			</div>
		</fieldset>
		<div>
			<fieldset>
				<legend>Status</legend>
				<div id="status"></div>
			</fieldset>
			<fieldset class="component" style="width: 300px;">
				<legend id="componentLegend"></legend>
				<div id="CargoBay">Space to store come cargo. <div class="CargoBay_NonEmpty">It contains: <ul></ul>
					</div>
					<div class="CargoBay_Empty">It is empty</div>
				</div>
				<div id="Ballast">Dead weight added here to compensate <b></b> component on the other side</div>
				<div id="Passage">Helps you walk around the ship. <br> Hint: use WASD to walk around. If it doesn't work - click here, change keyboard language to English or disable CapsLock</div>
				<div id="Airlock">Lets you get from one ship to another. You can also <button id="Airlock_Detach">Detach</button> your ship from theirs. </div>
			</fieldset>
		</div>
	</div>
	<script src="space2d3-2-walking-and-detaching.js"></script>
</div>
