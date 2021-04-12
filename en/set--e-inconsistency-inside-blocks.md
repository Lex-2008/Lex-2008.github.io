title=set -e inconsistency inside blocks
intro=<code>set -e</code> might work not as you expected inside (parentheses).
tags=Bash
created=2019-02-15

You know what `set -e` does, right? It aborts execution as soon as one of commands returns non-0 result. For example, the following code:

	set -e
	true 1
	false 2
	true 3

will be executed like this:

	$ bash -x test.sh
	+ set -e
	+ true 1
	+ false 2

[p]: using-true-instead-of-echo-to-debug-bash-scripts.html

Note that here I'm using the `true` debugging trick mentioned in [previous blog post][p].
Above is true for parenthesised blocks, too:

	set -e
	(
		true 1
		false 2
		true 3
	)
	true 4

Output of running this script will be exactly the same as before.

But what if you want to continue after failing block? For example, writing this:

	set -e
	(
		true 1
		false 2
		true 3
	) || true 4
	true 5

One might expect parenthesised block to be aborted after `false 2` command, then "alternative" command `true 4` to be executed, and execution continue. But actual execution is like this:

	$ bash -x test.sh
	+ set -e
	+ true 1
	+ false 2
	+ true 3
	+ true 5

Before you ask - it will be the same even if you add extra `set -e` inside the block, too.
What happens is that, it seems, `set -e` is totally ignored inside the block, happily continuing to `true 3` statement,
and its return code is used as return code of the whole braced statement - hence `true 4` command is not executed.

Same happens with parentheses inside `if`:

	$ cat test.sh
	set -e
	if (
		true 1
		false 2
		true 3
	); then
		true pass
	else
		true fail
	fi
	$ bash -x test.sh
	+ set -e
	+ true 1
	+ false 2
	+ true 3
	+ true pass

&nbsp;

Workarounds
-----------

First workaround is putting `&&` at the end of each line, like this:

	$ cat test.sh
	set -e
	(
		true 1 &&
		false 2 &&
		true 3
	) || true 4
	true 5
	$ bash -x test.sh
	+ set -e
	+ true 1
	+ false 2
	+ true 4
	+ true 5

But well, in that case you can omit parentheses altogether:

	set -e
		true 1 &&
		false 2 &&
		true 3 ||
		true 4
	true 5

Not sure what indentation should look like, though.

Another workaround is making it `set +e` on the outside, `set -e` on the inside, and preserving return code, like this:

	$ cat test.sh
	set -e
	set +e
	(
		set -e
		true 1
		false 2
		true 3
	)
	result=$?
	set -e
	test "$result" = "0" || true 4
	true 5
	$ bash -x test.sh
	+ set -e
	+ set +e
	+ set -e
	+ true 1
	+ false 2
	+ result=1
	+ set -e
	+ test 1 = 0
	+ true 4
	+ true 5

<script src="/microlight.js"></script>
