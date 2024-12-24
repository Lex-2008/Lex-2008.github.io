title=git split commit
uuid=50cb3253-32bd-4e5c-bb19-33ea03581278
intro=TL;DR: <tt>git rebase -i</tt>, <tt>e</tt>dit, <tt>git reset HEAD~</tt> and create new commits
tags=git
style=
styles=
created=2024-06-25
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

When you squashed too much and want to split a git commit into several ones.
More wordy explanation [on StackOverflow][x], shorter version here:

1. Use `git rebase -i ...`

2. Mark desired commit to be `e`dited

3. Rebase will now pause _after_ this commit

4. Run `git reset HEAD~` to cancel the commit

5. Use your favourite tool(s) to create new commits

6. When finished, run `git rebase --continue`

Note that you should commit all changes!

Also note that this approach deletes old commit and creates new ones, so date and author will be reset.

----

Alternatively, to move a change from a commit _into a new_ commit (for example, adding a sub-feature to a new feature), you can:

1. Use `git rebase -i ...`

2. Mark desired commit to be `e`dited

3. Rebase will now pause _after_ this commit

4. Edit file(s) to **reverse** the change (in our example, remove the sub-feature)

5. Create a (temporary) commit, call it "reverse sub-feature", for example

6. Immediately after that, run `git revert HEAD`

7. It will create a new commit, and call it "Revert: reverse sub-feature" - cancel the double-negative and reword it to "add sub-feature"

6. Run `git rebase --continue` to finish the rebase

1. Use `git rebase -i ...` _again_, to fixup your temporary commit ("reverse sub-feature" in our example) into the main commit

And then you'll have your main commit _without_ the sub-feature, followed by a commit adding the sub-feature - exactly what you wanted!

----

Also, as a bonus - one-liner to create individual commits for each modified file:

	git status --porcelain | sed 's/^...//' | xargs -I% sh -c 'git add %; git commit -m "cleanup %" '

[x]: https://stackoverflow.com/questions/6217156/break-a-previous-commit-into-multiple-commits/6217314#6217314
