title=Colors 2
intro=A CSS-only version of fancy 2D background gradient
tags=css
style=html {color-scheme: light;}
styles=archive
created=2016-06-29
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde


<div>
<style>
body {background: linear-gradient(
		rgba(255,0,255,0.5),
		rgba(255,255,0,0.5),
		rgba(0,255,255,0.5),
		rgba(255,0,255,0.5)),
     linear-gradient(to right, #f00, #0f0, #00f);
}
body > * {
	background: rgba(255,255,255,0.6);
	padding: 1ex;
}
</style>
</div>

I've [noted][] before how to create a fancy 2D gradient using javascript.
That's fancy. And a lot of code. And it makes sense in some cases.
In another cases one might as well consider this simple CSS style:

[noted]: colors.html

	background:
		linear-gradient(
			rgba(255,0,255,0.5),
			rgba(255,255,0,0.5),
			rgba(0,255,255,0.5),
			rgba(255,0,255,0.5)),
		linear-gradient(to right, #f00, #0f0, #00f);

You can see it applied to `<body>` element on this very page.
Maybe not as nice, but it definitely works!

Inspired by [this][] [(archived)](http://archive.is/4unnE) article,
but has next-to-nothing in common. (Although it worth reading, too!)

[this]: http://rentafounder.com/textured-gradients-in-pure-css/
