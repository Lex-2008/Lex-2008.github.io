function randomInt(a, b) {
	if(a>b) [a,b]=[b,a];
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

function randomFrom(a){
	return a[Math.floor(Math.random()*a.length)];
}

function shuffle(array) {
	return array.map((a) => ({ sort: Math.random(), value: a }))
		.sort((a, b) => a.sort - b.sort)
		.map((a) => a.value)
}

function seq(a) {
	return [...Array(a).keys()]
	//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}
