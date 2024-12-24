title=expand * in bash prompt
uuid=c6543fb4-9079-45c3-a12e-e357e566b354
intro=<b>TL;DR:</b> <code>ls &lt;Esc&gt;*</code>
tags=bash
style=
styles=
created=2024-01-19
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

A quick note: if you can't simply are too lazy to build proper expressions to include several files while excluding some others on the _interactive_ command prompt, you can simply expand `*` online.
For that, prefix it with `<Esc>` button press.
Just note that it works only when prefixed with some command, for example `ls`, and not with an empty command prompt.
It also works with prefixes, like this:

	ls /b<Esc>* -> ls /bin /boot

But I'm not sure how to make it work with suffixes, like `ls *.txt`.

If someone can find where I've read about it, or some kind of documentation - I'll be happy to link it from here!
