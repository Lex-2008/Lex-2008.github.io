title=Using true instead of echo to debug bash scripts
intro=<b>TL;DR:</b> When running scripts with <code>bash -x</code>, use <code>true …</code> instead of <code>echo …</code>, to avoid duplicate output
tags=Bash
created=2019-01-09

Sometimes we use `echo` to debug bash scripts, like this:

	echo Beginning computation...
	some_commands
	result="$(something_else)"
	echo "function returned $result"

Then, to aid debugging even more, we run the whole script with `bash -x script.sh`.
This prints each line before it gets executed.
As a result, you will see each `echo` line twice: once before it gets executed and once for `echo` output, like this:

	+ echo Beginning computation...
	Beginning computation...
	+ some_commands
	+ result="$(something_else)"
	+ echo function returned twnty
	function returned twnty

If you don't fancy seeing duplicate lines, you can just replace `echo` with `true`, like this:

	true Beginning computation...
	some_commands
	result="$(something_else)"
	true "function returned $result"

`true` accepts any number of arguments and simply ignores them.
But `bash -x script.sh` output will look nicer:

	+ true Beginning computation...
	+ some_commands
	+ result="$(something_else)"
	+ true function returned twnty

Moreover, if you like separating different parts of your script with comment lines like this:

	part_one
	# ================
	part_two

Then just replacing first comment character `#` with `true` will forward these lines to `bash -x` log:

	$ cat sctipt.sh
	part_one
	true ================
	part_two

	$ bash -x sctipt.sh
	+ part_one
	+ true ================
	+ part_two

Thanks [Vratislav](https://github.com/vpodzime) for this trick!

<script src="/microlight.js"></script>
