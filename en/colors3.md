title=Colors 3
uuid=cfda133a-8f58-4cd5-8aa6-7069d742f3ac
intro=A nicer version of CSS-only 2D background gradient
tags=css
style=html {color-scheme: light;}
created=2022-10-22
PROCESSOR=cat

<div>
<style>
body {background: linear-gradient(
		to bottom in hsl,
		rgba(255,0,255,0.5),
		rgba(255,255,0,0.5),
		rgba(0,255,255,0.5),
		rgba(255,0,255,0.5)),
     linear-gradient(to right in hsl, #f00, #0f0, #00f);
}
body > * {
	background: rgba(255,255,255,0.6);
	padding: 1ex;
}
</style>
</div>

<p>Compare background of this page with the <a href="colors2.html">previous version</a> and enjoy the progress of CSS!</p>

<pre>
background:
	linear-gradient(
		to bottom in hsl,
		rgba(255,0,255,0.5),
		rgba(255,255,0,0.5),
		rgba(0,255,255,0.5),
		rgba(255,0,255,0.5)),
     linear-gradient(to right in hsl, #f00, #0f0, #00f);
</pre>

<div id="no" style="display:none">
This page demonstrates a CSS feature that is not supported by your browser.
Please try a different browser.
I was told that Safari Tech Preview with Gradient Interpolation Color Spaces enabled works on this page.
Alternatively, you can <a href="https://web.dev/state-of-css-2022/#gradient-color-spaces">read more about it here</a>.
<script>
if(! CSS.supports("(background: linear-gradient(in hsl, black, white))")) {
	document.body.parentNode.style.colorScheme='light dark';
	document.querySelector('main').innerHTML=document.querySelector('#no').innerHTML;
	}
</script>
</div>
