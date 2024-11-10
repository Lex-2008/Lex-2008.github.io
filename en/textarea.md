title=textarea
intro=If you need a quick place to write down your thoughts and you find yourself in front of a web browser, then instead of launching <tt>notepad.exe</tt> you might want to type <tt style="white-space: nowrap">data:text/html,&lt;textarea&gt;</tt> in the address bar
tags=html
style=textarea{width:100%}
styles=
created=2024-08-13
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Alternatively, here's a slightly more advanced version:

	data:text/html,<style>*{width:100%;height:100%;margin:0;color-scheme:light dark}</style><textarea>

It fills whole page and also supports dark mode.

You can add this link to bookmarks (note that it won't open if you click it, so you need to be creative, for example drag-and-drop it to your bookmark bar): [textarea][]

[textarea]: data:text/html,<style>*{width:100%;height:100%;margin:0;color-scheme:light%20dark}</style><textarea>

Alternatively, you can as well simply use textarea on this page:

<textarea rows=25></textarea>

It totally doesn't send me everything you type, but do you trust me?
