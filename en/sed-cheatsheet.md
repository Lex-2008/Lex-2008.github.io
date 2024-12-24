title=sed cheatsheet
uuid=aa180e7a-a0d2-47eb-9174-a518f7f6829e
PROCESSOR=Markdown.pl
intro=A helpful guide to a simple programming language I still don't comprehend
tags=bash
created=2015-10-30
modified=2015-11-02
modified_now=1


While fixing the script at the bottom [of this page][rec], I found a nice and helpful cheatsheet worth saving for future reference.

	:  # label
	=  # line_number
	a  # append_text_to_stdout_after_flush
	b  # branch_unconditional
	c  # range_change
	d  # pattern_delete_top/cycle
	D  # pattern_ltrunc(line+nl)_top/cycle
	g  # pattern=hold
	G  # pattern+=nl+hold
	h  # hold=pattern
	H  # hold+=nl+pattern
	i  # insert_text_to_stdout_now
	l  # pattern_list
	n  # pattern_flush=nextline_continue
	N  # pattern+=nl+nextline
	p  # pattern_print
	P  # pattern_first_line_print
	q  # flush_quit
	r  # append_file_to_stdout_after_flush
	s  # substitute
	t  # branch_on_substitute
	w  # append_pattern_to_file_now
	x  # swap_pattern_and_hold
	y  # transform_chars


Thanks to StackOverflow user [Peter.O][user] for his helpful [comment][source]!

[rec]: spam-emails.html#script
[source]: http://unix.stackexchange.com/questions/26284/how-can-i-use-sed-to-replace-a-multi-line-string#answer-26290
[user]: http://unix.stackexchange.com/users/2343/peter-o
