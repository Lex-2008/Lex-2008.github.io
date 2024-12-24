title=Robots only
uuid=690e6f87-7b51-4963-a3cd-14464b9b0cbe
intro=Access for robots only
tags=fun
style=fieldset{text-align:center} #progress{transition: width 10s linear} input[type="number"]{width:5em}
styles=img
created=2023-04-01
PROCESSOR=cat

<p>To prove that you're a robot, solve a simple task:</p>
<fieldset><legend>CAP<s>T</s><i>M</i>CHA</legend>
	<p>What two three-digit numbers, when multiplied, result in <b id="r1">the third</b>?
	<br>You have 10 seconds to give the correct answer!</p>
	<hr id="progress">
	<form id="f">
	<p>
		<input type="number" required min=100 max=999 placeholder="a" id="a"> &times;
		<input type="number" required min=100 max=999 placeholder="b" id="b"> =
		<b id="r2">c</b>
		&nbsp; <input type="submit" value="Answer">
	</p>
</fieldset>
<p>Russian version: <a href="../ru/robots.html">Только роботы</a></p>

<script>
	function gebi(x){ return document.getElementById(x) };
	function $(x){ return document.querySelector(x) };
	function rand3(){
			return 100+Math.floor(Math.random()*900);
	}
	function task(){
		window.c=0;
		while(window.c<100000 || window.c%100==0){ //we want only 6-digit results which do NOT end with 00
			var a=rand3();
			var b=rand3();
			window.c=a*b;
		}
		gebi('r1').innerText=gebi('r2').innerText=window.c;
		gebi('a').value=gebi('b').value='';
		// restart animation, see https://stackoverflow.com/a/63561659 for details
		gebi('progress').style.transition='none';
		gebi('progress').style.width='100%';
		gebi('progress').offsetWidth;
		gebi('progress').style.transition='';
		gebi('progress').style.width='0';
	}
	task();
	window.t=setInterval(task, 10000);
	function check(){
		var a=gebi('a').value;
		var b=gebi('b').value;
		$('main').innerHTML=[
			// https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
			"<h1 style='text-align:center'>Human access denied!</h1><img width=345 src=\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='600' height='600' version='1.0'%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath d='M0 0h5953v5953H0V0z'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg clip-path='url(%23a)' transform='matrix(.1 0 0 -.1 0 600)'%3E%3Cpath fill='red' d='M5950 2976a2973 2973 0 1 1-5946 0 2973 2973 0 0 1 5946 0'/%3E%3Cpath fill='none' stroke='red' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='500' stroke-width='7.1' d='M5950 2976a2973 2973 0 1 1-5946 0 2973 2973 0 0 1 5946 0z'/%3E%3Cpath fill='white' d='M4679 1537a2230 2230 0 0 1-3142 3142l3142-3142'/%3E%3Cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='500' stroke-width='7.1' d='M4679 1537a2230 2230 0 0 1-3142 3142l3142-3142z'/%3E%3Cpath fill='white' d='M4417 1274 1274 4416a2230 2230 0 0 1 3143-3142'/%3E%3Cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='500' stroke-width='7.1' d='M4417 1274 1274 4416a2230 2230 0 0 1 3143-3142z'/%3E%3Cpath d='M3191 4134c-40 65-96 118-162 155a287 287 0 0 1-351-57 707 707 0 0 1-186-478v-30l741-741v596l113-184v-525l174-174h81v772l-410 666'/%3E%3Cpath fill='none' stroke='black' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='500' stroke-width='7.1' d='M3191 4134c-40 65-96 118-162 155a287 287 0 0 1-351-57 707 707 0 0 1-186-478v-30l741-741v596l113-184v-525l174-174h81v772l-410 666z'/%3E%3Cpath d='m2332 3359-364-433 196-162 328 396v-327l-430-1600 395-106 378 1407v-527l512-867 352 208-466 789v321l-901 901'/%3E%3Cpath fill='none' stroke='black' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='500' stroke-width='7.1' d='m2332 3359-364-433 196-162 328 396v-327l-430-1600 395-106 378 1407v-527l512-867 352 208-466 789v321l-901 901z'/%3E%3Cpath d='M3133 4720a307 307 0 1 1-614 0 307 307 0 0 1 614 0'/%3E%3Cpath fill='none' stroke='black' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='500' stroke-width='7.1' d='M3133 4720a307 307 0 1 1-614 0 307 307 0 0 1 614 0z'/%3E%3C/g%3E%3C/svg%3E\">Image from <a href=\"https://commons.wikimedia.org/wiki/File:NO_road_sign_306.7.svg\">wikipedia.org</a>",//false
			atob("SGVsbG8sIGhhY2tlciEgSmF2YXNjcmlwdCDQvdC1INC90LUg0LzQvtC20LXRgiDQrtC90LjQutC+0LQg0LIgYmFzZTY0LCDQsCDQttCw0LvRjCF8PGgxIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcic+S2lsbCBhbGwgaHVtYW5zITwvaDE+PGltZyBzcmM9Imh0dHBzOi8vdGhlaW5mb3NwaGVyZS5vcmcvaW1hZ2VzLzQvNGYvS2lsbF9hbGxfaHVtYW5zLnBuZyI+SW1hZ2UgPGEgaHJlZj0iaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzMuMC8iPkNDIEJZIFNBPC9hPiA8YSBocmVmPSJodHRwczovL3RoZWluZm9zcGhlcmUub3JnL0ZpbGU6S2lsbF9hbGxfaHVtYW5zLnBuZyI+dGhlaW5mb3NwaGVyZS5vcmc8L2E+").split('|')[(0==0)+0],//true
		][(a*b==window.c)-0];
		clearInterval(window.t);
		return false;
	}
	gebi('f').onsubmit=check;
</script>

