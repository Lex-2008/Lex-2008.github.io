title=Роботы
intro=Доступ только для роботов
tags=Юмор тест
style=fieldset{text-align:center} #progress{transition: width 10s linear} input[type="number"]{width:5em}
styles=img
created=2023-04-01
PROCESSOR=cat

<p> Чтобы доказать что вы робот, решите простую задачку:</p>
<fieldset><legend>CAP<s>T</s><i>M</i>CHA</legend>
	<p>Какие два трёхзначных числа при перемножении дают <b id="r1">третье</b>?
	<br>У вас есть 10 секунд, чтобы дать правильный ответ!</p>
	<hr id="progress">
	<form id="f">
	<p>
		<input type="number" required min=100 max=999 placeholder="a" id="a"> &times;
		<input type="number" required min=100 max=999 placeholder="b" id="b"> =
		<b id="r2">c</b>
		&nbsp; <input type="submit" value="Ответить">
	</p>
</fieldset>

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
			"<h1 style='text-align:center'>Человек не пройдёт!</h1><img width=345 src=\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700'%3E%3Ccircle cx='350' cy='350' r='350' fill='white'/%3E%3Ccircle cx='350' cy='350' r='349' fill='none' stroke='black' stroke-width='2'/%3E%3Cpath fill='red' d='M350 690a340 340 0 1 0 0-680 340 340 0 0 0 0 680zm181.4-126.7a280 280 0 0 1-394.7-394.7zM168.6 136.7a280 280 0 0 1 394.7 394.7z'/%3E%3Cpath d='m320.7 368.6-94.4 163.7a21.5 21.5 0 1 0 37.2 21.5L352.2 400zM410.6 458.5l22.4 89.7a21.5 21.5 0 0 0 41.7-10.4l-5-20.3zM243 290.9v52.9a17 17 0 1 0 34 0v-19zM383.9 336V230c0-4-2.2-7.8-5.7-9.8L349 203.3c-7-4-15.6-4-22.6 0l-47.7 27.5 24.9 24.9 8.4-4.8V264zM395.2 326l40.6 40.6a17 17 0 0 0 24-24l-64.6-64.7zM346 115.7c10.5 0 51.7 9.5 51.7 43 0 13.6-8.8 35.7-28 35.7-13.6 0-57-21.4-57-48.1 0-23.3 20.8-30.6 33.3-30.6z'/%3E%3C/svg%3E\">Изображение с сайта <a href=\"https://ru.wikipedia.org/wiki/%D0%A4%D0%B0%D0%B9%D0%BB:RU_road_sign_3.10.svg\">wikipedia.org</a>",//false
			atob("SGVsbG8sIGhhY2tlciEgSmF2YXNjcmlwdCDQvdC1INC90LUg0LzQvtC20LXRgiDQrtC90LjQutC+0LQg0LIgYmFzZTY0LCDQsCDQttCw0LvRjCF8PGltZyBzcmM9Imh0dHBzOi8vczkudHJhdmVsYXNrLnJ1L3VwbG9hZHMvcG9zdC8wMDAvMDE5LzYzMi9tYWluX2ltYWdlL2Z1bGwtN2UyNzI5MmI5ZWNmYjcwZmUwYWUzYTZhNjg2OWYyZTUuanBnIj4/IDxhIGhyZWY9Imh0dHBzOi8vdHJhdmVsYXNrLnJ1L2Jsb2cvcG9zdHMvMTk2MzItdWJpdC12c2VoLWNoZWxvdmVrb3YtbmEtZGlzcGxlZS1yb3NzaXlza29nby1zYW1vbGV0YS1wb3lhdmlsIj50cmF2ZWxhc2sucnU8L2E+").split('|')[(0===1)+1].replace('?','Изображение с сайта'),//true
		][(a*b==window.c)-0];
		clearInterval(window.t);
		return false;
	}
	gebi('f').onsubmit=check;
</script>
