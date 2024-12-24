title=Redirecting custom file descriptor to subprocess
uuid=d2f53879-374a-44ab-bcf4-bbae8894ffbb
PROCESSOR=Markdown.pl
intro=TL;DR: 3> >(command)
tags=bash
created=2016-09-19
modified=2016-09-21
modified_now=1


[link]: http://tldp.org/LDP/abs/html/process-sub.html

[Process Substitution][link] is nice, but rarely used Bash feature.
It lets you put (in/out)put of one process in where another process expects a file.

For example (not real code):

	ls | tee >(mail -s "listing" user@example.com)

lets you show output of `ls` command on the screen and email it at the same time.

Also, it can be used with `exec`:

	exec >(tee ~/log)

to append all following script output to a file while printing it to the screen.


But what if you want to do it, while using a stream other then 1 (stdout)?
Naive code like this

	3>(command)

Will fail with a cryptic error message.

Instead, you must understand that Bash replaces the >(...) syntax with
file descriptor name in the command line
(try `echo <(true)` if you don't believe),
and that full syntax for working with custom streams looks like this:

	N > file

(spaces are optional, N is the number of stream / file descriptor)

So what you actually want is written at the top of this article:

	3> >(command)

where `3` is the number of your stream,  
first `>` is redirection command,  
then space to distinguish it from `>>` "append" redirect,  
and `>(` begins the process substitution.
