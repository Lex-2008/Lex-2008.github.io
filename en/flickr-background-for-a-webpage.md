title=Flickr background for a webpage
uuid=02b7f9ac-1977-482f-98d9-67f8fc75b21b
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
intro=Another attempt to add something nice to this blog
tags=Javascript
created=2017-06-17
style=html {color-scheme: light} body > * {background: rgba(255,255,255,0.6); padding: 1ex}

Having [nice background][rss] on a lock screen,
why not add a similar to the website?

[rss]: flickr-feed-generator-for-xscreensaver.html

It's easy to achive just by using this code:

<div>
<pre id="aa"></pre>

<script id="a1">
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', '/unlisted/flickr.rss', false);
xmlhttp.send(null);
if(xmlhttp.status == 200) {
  link=xmlhttp.responseText.match(/https:[^"]*/)[0];
  document.body.style.background='url('+link+') fixed';
  document.body.style.backgroundSize='cover';
}
</script>

<script>
	gebi=function(q){return document.getElementById(q)}
	gebi('aa').innerHTML=gebi('a1').innerHTML;
</script>

It just takes the first link from a generated rss feed and sets it as background.

So background of this page changes every 3 hours. Please come back in 3 hours! ;-)

Also note my previous experiments with the background: [Colors][], [Colors 2][].

[Colors]: colors.html
[Colors 2]: colors2.html
