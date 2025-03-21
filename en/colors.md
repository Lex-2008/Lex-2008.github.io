title=Colors
uuid=81fd6323-74ed-4f83-a6af-1a7935dad091
intro=Let's add a colorful background to this blog, hm?
tags=javascript
style=html {color-scheme: light;}
created=2014-09-03
PROCESSOR=cat

<div>
Main function is blantly copy-pasted from an open source <a href="https://github.com/operasoftware/dragonfly/blob/master/src/lib/canvasrenderingcontext2dprototype.js" class="github">dragonfly</a> project.
Thanks <a href="https://github.com/chriskr" class="Krebs">Christian Krebs</a> for pointing me at it.

<script id="a1">
CanvasRenderingContext2D.prototype.draw_2d_gradient = function(top_color_list,
                                                               bottom_color_list,
                                                               flip)
{
  if (typeof bottom_color_list == "boolean")
  {
    flip = bottom_color_list;
    bottom_color_list = null;
  }

  if (!this._src_canvas)
  {
    // alert("this._src_canvas not set")
    this._src_canvas = document.createElement("canvas");
    this._src_ctx = this._src_canvas.getContext("2d");
  }
  var width = this._src_canvas.width = this.canvas.width;
  var height = this._src_canvas.height = this.canvas.height;
  var set_stop = function(color, index, list)
  {
    this.addColorStop((1 / (list.length - 1 || 1)) * index, color);
  };
  var lg = flip
         ? this._src_ctx.createLinearGradient(0, 0, 0, height)
         : this._src_ctx.createLinearGradient(0, 0, width, 0);
  this._src_ctx.clearRect(0, 0, width, height);
  top_color_list.forEach(set_stop, lg);
  this._src_ctx.fillStyle = lg;
  this._src_ctx.globalCompositeOperation = "source-over";
  this._src_ctx.fillRect(0, 0, width, height);
  this.drawImage(this._src_canvas, 0, 0);
  if (bottom_color_list)
  {
    this._src_ctx.clearRect(0, 0, width, height);
    lg = flip
         ? this._src_ctx.createLinearGradient(0, 0, width, 0)
         : this._src_ctx.createLinearGradient(0, 0, 0, height);
    lg.addColorStop(0, "hsla(0, 0%, 0%, 0)");
    lg.addColorStop(1, "hsla(0, 0%, 0%, 1)");
    this._src_ctx.fillStyle = lg;
    this._src_ctx.fillRect(0, 0, width, height);
    this._src_ctx.globalCompositeOperation = "source-in";
    lg = flip
         ? this._src_ctx.createLinearGradient(0, 0, 0, height)
         : this._src_ctx.createLinearGradient(0, 0, width, 0);
    bottom_color_list.forEach(set_stop, lg);
    this._src_ctx.fillStyle = lg;
    this._src_ctx.fillRect(0, 0, width, height);
    this.drawImage(this._src_canvas, 0, 0);
  }
};
</script>

<style id="s1">
/* position canvas as a background */
html { position: relative; }
canvas{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	z-index: -1;
	}
/* make it look nice */
body > * {
	background: rgba(255,255,255,0.6);
	padding: 1ex;
}
canvas{
	padding: 0 !important;
}
</style>

<script id="a2">
document.body.appendChild(document.createElement('canvas'));
rnd_col=function(){return 'hsl('+Math.round(Math.random()*360)+',50%,50%)'};
document.querySelector('canvas').getContext("2d").draw_2d_gradient(
    [rnd_col(),rnd_col(),rnd_col(),rnd_col()],
    [rnd_col(),rnd_col(),rnd_col(),rnd_col()],
    true);
</script>

<h2>Code</h2>
<pre id="aa"></pre>

<h2>Style</h2>
<pre id="ss"></pre>
<script>
gebi=function(q){return document.getElementById(q)}
gebi('aa').innerHTML=gebi('a1').innerHTML+'\n\n'+gebi('a2').innerHTML;
gebi('ss').innerHTML=gebi('s1').innerHTML;
</script>
<style>
main a{white-space: nowrap;}  /* to keep github icons next to links */
pre .string {color: navy} /* for when microlight.js thinks this page is in dark mode */
.github::before, .Krebs::before {
	width: 16px;
	height: 16px;
	display: inline-block;
	content: " ";
	background-repeat: no-repeat;
}
.github::before {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAPBQTFRFAAAAFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUWFxUW/////vV4UQAAAE50Uk5TAAALT6fh/B6X7R+0/grFdr7iz1EDFCIVqYkCiOo22Bj7Id72XKLySQwNSNLlqqbstjg5s+gGi2aFmiMy/YoXyWNFpYTd1yDkgz5yEXE9cKDDvgAAAAFiS0dET25mQUkAAAAJcEhZcwAAAEgAAABIAEbJaz4AAADXSURBVBjTNY7XcoJQFEXPtuBFQb2IYAgqthRCTCU9pmiqyf7/z8mNjOdtrZm95ogISuVK1bKqlXIJYhA1ZXNztqoBgnrDcQrhOI06xFVsttra83S71aRypWNT+d0gDIOur2h3pEfuRP8xQbRL9kQz7qMQ6MfUYnEw3LAxwwEtSahHWzHSTGTMyXQ7mU44lpmz5+0fRIB/mB6RM0mz4/nJ6RlwfmEevkwlv4qvb27vgPuYfHjMBYv50/OLCwQZk9eFqSFcrt7ejfjIPsOinn99r4H1z29u+A9TKhzHslwdpAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0xMS0wMlQxMzozMDo1MCswMTowMFqG0AoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTMtMDQtMTVUMjI6NDk6MzArMDI6MDDPs7dCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==);
}
.Krebs::before {
	background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAEAAQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A4v4kfCFNI1Ww8K2Pn3PiHU4zIjRsBFaxZwZZGPTOGCgA5IrZ8P8AwHju0eyuZon1O2UNLbxyjfsP3XwcEA4I+oOOMV6N8OvDFv451e88bXyeIVuruMrJaQEG0iCHLJIA3muABlYwwBB6Nk1ynxGu9Iu7q61fwWPEWqa5pCIZNbjcSWsCZbzYzEHYou4j92AAACTkYr9f/tXEOoqUqln1fS/+R8V9Qpez5ox/zP/Z);
}
</style>

<script src="/microlight.js"></script>
<script>microlight.reset('pre')</script>
</div>
