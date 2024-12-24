title=Clear terminal scrollback on mac
uuid=121e3534-ec71-40fd-94fb-207eef6a06b5
intro=TL;DR: <tt>printf '\e[3J'</tt>
tags=mac
style=
styles=
created=2024-11-11
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Depending on your terminal, simple `clear` might clean only the visible portion of the screen, leaving scrollback intact.
Sometimes it might be not what you want, and then `printf '\e[3J'` might help you.
Note that sometimes this command might clean _only_ scrollback, and you might want to have both!

Source: [stackoverflow][x].

[x]: https://stackoverflow.com/questions/29887629/how-to-clear-terminal-mac-osx-scrollback

A good header for a script that produces a lot of output then looks like this:

	clear
	printf '\e[3J'
	set -ex

It first clears visible screen and scrollback, and then enables failing on error and echoing lines to be executed
