title=GitHub Flavored Markdown
intro=After some time of pondering, I switched to GitHub-Flavoured Markdown (GFM)
tags=meta
style=
styles=footnotes hr
created=2022-10-15
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
uuid=a76ed1e3-dcc1-48f0-876e-013a662884c3

[cm]: https://commonmark.org/

Main thing that made me convert was that it's based on [CommonMark][cm],
which claims to be one of the fastest Markdown renderers.
And indeed, in my limited testing, a file which Markdown.pl took 0.1 second to process,
both `cmark` and `cmark-gfm` processed in 0.002s - at least 50 times faster!
Also it supports all fancy features that I desired:

- [x] tables
- [x] tasklists (like this one)
- [x] ~~strikethrough~~ text
- [x] footnotes[^1]

[^1]: I actually didn't want footnotes _that_ much, but they look nice and might be useful sometimes.
Maybe?

Also, there are some features that I actually don't care that much about, so won't even mention them :)

GitHub has a very wordy [introduction][i] into their version of Markdown,
which also covers not only GFM, but also GitHub-specific features,
like `@mentions`.
Also they have more technically-worded [spec][], which is based on CommonMark's spec,
thus being also very verbose.
But at least they highlight GFM-specific features in a different color!

[i]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
[spec]: https://github.github.com/gfm/

*****

I only need to be careful when converting old posts into new format.
For example, this markdown source:

        First line
        - second line
        third line

gets treated differently by Markdown.pl and CommonMark / GFM!
Markdown.pl sees it all as a single paragraph,
while others - as a line and a bullet list, i.e.
like this source:

        First line

        * second line third line

That's because Markdown.pl requires an empty line before each list item.

Oh well.

*****

But it means that I can't just replace call to `Markdown.pl` with a call to `cmark-gfm`!
It should be configurable per-file.
But actually it turned out to be pretty easy to achieve:
Lazyblog already has _templating_ which is configured with env variables,
so it's trivial to add a new env variable
(with default value of `Markdown.pl`),
which can be overwritten by each file before it's processed by a markdown interpreter.
Naturally, it also means that if a file sets this variable
(called `PROCESSOR`)
to value `cat` -
then it's **not** processed, and thus can be written in plain HTML!
Nice!

Relevant commit in git repo: [5bceaf][].

[5bceaf]: https://github.com/Lex-2008/lazyblog/commit/5bceafd4e1eb6e48e9a7fb1027712bb9fb4aea75
