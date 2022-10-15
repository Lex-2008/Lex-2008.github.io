title=Paste and replace in Vim
PROCESSOR=Markdown.pl
intro=How to copy-paste text from one place to another, replacing what's already there
tags=vim
created=2013-01-16
modified=2013-01-16
modified_now=1

<div>
<br>Consider the following situation:<pre>f(good);
...&lt;somewhere below&gt;...
f(bad)</pre> and you want to change it to this: <pre>f(good);
...&lt;somewhere below&gt;...
f(good)</pre>
<br>Usual Windows-way would be:<br><ol>
<li>select "good" and copy it to clipboard</li>
<li>select "bad" and paste stuff from clipboard</li>
</ol>
<br>How to achieve the same in Vim, without using extra <tt>"x</tt> registers?<br><br>Visual mode to rescue!<br><ol>
<li>(Y)ank (copy) "good" text (<tt>yib</tt> to (Y)ank (I)nside (B)rackets when cursor is in "good" word)</li>
<li>Move the cursor to "bad" word</li>
<li>Select it (in visual mode) and paste stuff (<tt>vibp</tt> to go (V)isual, select (I)nside (B)rackets, and (P)aste)</li>
</ol>
<br><br>Related reading: <a href="http://vimdoc.sourceforge.net/htmldoc/visual.html">:help v</a> <a href="http://vimdoc.sourceforge.net/htmldoc/change.html#v_p">:help v_p</a>
</div>
