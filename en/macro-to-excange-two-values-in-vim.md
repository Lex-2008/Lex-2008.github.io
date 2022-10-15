title=Macro to excange two values in Vim
PROCESSOR=Markdown.pl
intro=You probably know <tt>ddp</tt> command in Vim to exchange two lines. But what if you want to exchange only parts of these lines?
tags=vim
created=2013-01-09

<div>

<br>For example, you have two parameters:
<br><pre>Parameter=Value
Another parameter=some other value
</pre>And you want to exchange their values to get this:
<br><pre>Parameter=some other value
Another parameter=Value
</pre>
<br>If you might need to do it more than once and your level of laziness (a.k.a. urge to optimize stuff) is somewhat close to mine, you might find this Vim command useful:
<br><tt>^f=l"qDj^f=l"wD"qpk^f="wp</tt>
<br>It does exactly that.
<br>
<br>To use it:
<br>
<ol>
<li>Copy-paste above line into Vim</li>
<li>Copy it into an internal Vim register (<tt>"xdd</tt> to cut current line to register x)</li>
<li>Put cursor somewhere in the first line and execute macro stored in your register (<tt>@x</tt>)</li>
</ol>As you probably know, Vim uses same registers both for copy-paste operations and for macros. Also it saves them between sessions in viminfo file, nice!
</div>
