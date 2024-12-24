title=How to delete a line from a file
uuid=c04cacbc-74d4-478b-a131-b5a3da871aa6
PROCESSOR=Markdown.pl
intro=If you know what line to delete...
tags=bash vim
created=2014-12-15
modified=2014-12-15
modified_now=1


Say, for example, you got this message from SSH:

	Offending key in /home/alexey/.ssh/known_hosts: 6

and you know what it means and you know why it's there and you want to remove it.

Vim
===

First, you can open your favourite text editor:

	$ vim .ssh/known_hosts

and then, type this to **G**o to the **6**th line, **D**elete it, and quit with saving (**ZZ**):

	6ggddZZ

Sed
===

But there's an easier way!

just use sed:

	$ sed -i 6d .ssh/known_hosts

to edit file **I**n-place by **D**eleting **6**th line.

Much less typing, don't you think?
