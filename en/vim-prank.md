title=Vim prank
uuid=30c25128-48bd-4d40-a368-742367b2da77
PROCESSOR=Markdown.pl
intro=An idea for an evil prank on your Vim-loving friend.
tags=vim fun
created=2012-12-02

**TL;DR:** in most other editors same effect is achieved by the following sequence: `Ctrl+A` `Del` `Ctrl+S` `Alt+F4`.

<div>

<br>I noticed that there are quite few posts on the Internet about <tt>ggdGZZ</tt> (or <tt>ggdG:wq!</tt>, which is effectively the same). As a second-time <a href="http://www.vim.org/others.php">Vim</a> newcomer, I feel obliged to make a post about it. Command explanation:
<ul>
<li>
<tt>ggdG</tt> clears current buffer:
<ul>
<li>
<tt>gg</tt> — go to first line
</li>
<li>
<tt>d</tt> — delete to...
</li>
<li>
<tt>G</tt> — last line
</li>
</ul>
</li>
<li>
<tt>:wq!</tt> or <tt>ZZ</tt> saves current buffer and closes it, leaving no way to undo.
</li>
</ul>

So next time your nerdy friend leaves Vim open and looks away for a few seconds — rush to it, smash in <tt>ggdGZZ</tt> and run away!
<br>Pro Tip: don't use &lt;Caps Lock&gt; button to start writing capital letters — some nerds like to remap it to something else.
<div class="warning">
<b>Warning!</b> Do not do it if you're not ready to cope with consequences!
</div>
Super-pro tip: if you're Pro Vim user having Vim newbie nearby, use <tt>ggg?G</tt> on him, optionally followed by <tt>ZZ</tt>. It's much less destructible — same command returns text back to readable form.<br>
</div>
