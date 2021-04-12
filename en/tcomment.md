title=TComment
intro=vim plugin for easy commenting
tags=vim links
created=2017-02-10
modified=2017-02-10
modified_now=1

Sometimes, when working with Python, I miss `/* C-style comments */`.
Especially when temporary commenting-out large blocks of code -
inserting `#` in the beginning of each line isn't much better
than typing `if False` at the top and identing each line.

TComment plugin helps in this cases!

Imagine that you have a code like this:

    # Python 3: Fibonacci series up to n
    def fib(n):
        a, b = 0, 1
        while a < n:
            print(a, end=' ')
            a, b = b, a+b
        print()
    fib(1000)

Have a cursor on the `while` word and want to comment-out the whole its block.
Maybe you could add them like this: `I# <Esc>j.j.` and remove like this `^xxj^xxj^xx` with two and four keypresses per line, respectively.
But if you install a TComment plugin - you can just select these lines in visual mode and press `gc`, like this: `Vjjgc`.
With only one keypress per line, and result looks like this:

    # Python 3: Fibonacci series up to n
    def fib(n):
        a, b = 0, 1
        # while a < n:
        #     print(a, end=' ')
        #     a, b = b, a+b
        print()
    fib(1000)

It can uncomment lines, too!

Links: [vim.org][], [Github][]

[vim.org]: http://www.vim.org/scripts/script.php?script_id=1173
[Github]: https://github.com/tomtom/tcomment_vim
