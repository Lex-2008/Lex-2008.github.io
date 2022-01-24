title=microlight.js
intro=a 2.2k library to hilight any code
tags=javascript
styles=archive
created=2016-06-16
modified=2016-06-30
modified_now=1


Today I learned about existence of [microlight.js][]
[(archived version)](http://archive.is/FhTPN)
- a small library to hilight any code.

Of course, it has some bugs and incompatibilities with Bash
- like, it has a list of keywords, among which is "from"
(it's a keyword in some languages),
and it highlights it in `rsync --exclude-from=/file/name`.
Or, it has a simple regexp detector, which considers everything
between forward slashes to be an regexp.
So if you put a UNIX path somewhere outside the quotes
- then it will hilight it like an regexp, like this:
`/usr/bin/bash`.

But what did you expect from a 2.2k library?
Language detection?!

[microlight.js]: https://asvd.github.io/microlight/

I'm actually using a modified version by [WolfieZero][gh],
which adds classes instead of hardcoded styles
(because I think that styles implemented by [original author][orig]
are not very good for white background),
and modified it a bit further to use `querySelectorAll` function
instead of `getElementsByClassName`
and to act by default on all `<code>` elements
(to make it out-of-the-box-compatible with markdown-generated markup)

[gh]: https://github.com/WolfieZero/microlight
[orig]: https://github.com/asvd/microlight

My modified version should appear below:

<div>
<pre><code id="aa"></code></pre>
<script>
gebi=function(q){return document.getElementById(q)}
xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', '/microlight.js', true);
xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		gebi('aa').innerHTML=xmlhttp.responseText;
		gebi('a1').innerHTML=xmlhttp.responseText;
	}
};
xmlhttp.send(null);
</script>
<script id="a1"></script>
</div>
