title=Bash on Bash
uuid=81f722c7-ae8c-44ab-9f58-e03ea681984f
PROCESSOR=Markdown.pl
intro=Started using new programming language, I feel irritated and want to blog about it :)
tags=bash
created=2014-03-22
modified=2016-06-16
modified_now=1


Deleting an item from array doesn't change indexes of other items
---
You can have arrays in Bash – "Hooray!", I thought:

	$ list=(apple banana grapes)
	$ echo "length of the list: ${list[*]}"
	length of the list: 3
	$ for i in 0 1 2; do echo "list[$i]=${list[$i]}"; done # print list items
	list[0]=apple
	list[1]=banana
	list[2]=grapes

So far – so good, but let's see what happens if you delete one item from this array:

	$ unset list[1] # delete an element
	$ echo "length of the list: ${list[*]}"
	length of the list: 2
	$ for i in 0 1 2; do echo "list[$i]=${list[$i]}"; done # print list items
	list[0]=apple
	list[1]=
	list[2]=grapes
Congrats, you deleted _first_ item, but in no way it affected _second_!
Also note that, unlike in other programming languages, you can't rely on the "list length" operator, either!
So, if you happen to delete array items, is the "solution" to keep array length in a separate variable, increase it when adding something to array, and never decrease?

Pipe creates subshell, effectively making all your variables local
---

You can have variables in Bash:

	$ a=0     # create a variable
	$ echo $a # show it
	0

You can redirect unputs, and it still works:

	$ a=1 < file.txt
	$ echo $a
	1

But if you happen to use _pipe_ – then be careful!

	$ cat file.txt | a=2
	$ echo $a
	1

In this case your command is running in subshell (?), and all your variables are "local".
The only way to communicate back to the calling script is by using return values, changing files or writing to stdout
(wrapping all your command into `output="$(...)"`)

<script src="/microlight.js"></script>
