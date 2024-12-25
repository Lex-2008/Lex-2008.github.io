title=My blog is also its own RSS feed
intro=<img src="//alexey.shpakovsky.ru/en/my-blog-is-also-rss-feed.png" style="float:right; margin-left:1ex"/>On the main page of this blog (which lists all posts), right-click an empty place and select "View Page Source (Ctrl+U)". What do you see? An RSS feed! (or, rather, it's technically an Atom feed, but who actually cares) But how? And... Why?!..
tags=meta
style=
styles=blockquote footnotes
created=2024-12-23
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
uuid=09e5aa11-35dd-4a9b-9af3-36282848b0e4

Apparently, it's possible to style RSS feed to look nicer than a raw XML when opened in a browser.
To do so, you need to use a thing called XSLT - eXtensible Stylesheet Language Transformation.
Basically, it's an XML document which explains how to transform one document (usually XML) into another one - for example, HTML.

W3schools has a simple [example][] of transforming an XML (in that example, some CD disc database) to an HTML.
Another simple example is [this][aboutfeeds] XSLT stylesheet for RSS 2.0 from author of aboutfeeds.com,
which I saw used on more than one website.

[example]: https://www.w3schools.com/xml/xsl_transformation.asp
[aboutfeeds]: https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl

But wait a second: RSS feed is a list of posts, with short summaries and links to original pages,
but main page of my blog is _also_ a list of posts with short summaries and links to original pages...
So can't beautified RSS feed serve as main page of my blog, too?

> **NOTE that** here I use term "RSS" in two ways:
>
>    * When I say "RSS feed", I'm talking about a general idea of website posting updates in a standardized, computer-readable format, _no matter what_ exact format.
>    * When I say "RSS 2.0", I'm talking about the [specific format][rss-spec] in which these updates are posted.
>
> Probably that's because I remember when RSS [first appeared][] in my browser,
> and since then the term got [genericized][] in my mind
> and started meaning not the specific technology but a general idea.

[rss-spec]: https://www.rssboard.org/rss-specification
[genericized]: https://en.wikipedia.org/wiki/Generic_trademark
[first appeared]: https://press.opera.com/2004/05/12/the-most-innovative-browser-opera-7-50-released-everything-you-need-online/

And after looking through [some][ex1] of more [complex][ex2] examples
and [Hacker News comments][atom-vs-rss-comment],
I&nbsp;decided to go with Atom feed format instead of RSS 2.0,
primarily for two reasons:
* it has a nicer format of dates, which is close to what I already use,
* it has a place for extra feed links, where I can put my "you may also like my" links,

and also because of the above comment mentioning that Atom is better specified
and has a place to put (X)HTML into it, while RSS 2.0 is relying on feed reader's interpretation.
So I loaded up [Atom spec][] in one tab,
Mozilla's [XSLT reference][] in another, and started hacking.

[ex1]: https://darekkay.com/assets/xsl/rss-style.xsl
[ex2]: https://chrismorgan.info/atom.xsl "search for `00:00:00` in this one, for some XSLT fun"
[Atom spec]: https://datatracker.ietf.org/doc/html/rfc4287
[XSLT reference]: https://developer.mozilla.org/en-US/docs/Web/XSLT
[atom-vs-rss-comment]: https://news.ycombinator.com/item?id=26167248#26169162

I thought it will take me two hours.
But it actually took me not two, but three.
And not hours, but days![^days-to-write]  😅

[^days-to-write]: and then more than a whole day to write this blog post

Also worth noting that XSLT has some features that make some Javascript parts of lazyblog redundant.
Like, you probably would expect XSLT to have [`<xsl:for-each>`][for-each] tag
to walk through all child elements of some element.
But it also has [`<xsl:sort>`][xsl-sort] tag (w3schools has a nice [example][xsl-sort-w3] for it),
which makes Javascript-powered sorting redundant.
Together with [`<xsl:if>`][xsl-if] and [`<xsl:choose>`][xsl-choose],
and with a bunch of [functions for string manupulation][xsl-functions],
this can replace filtering and maybe even search...
If only browsers had a feature to pass query parameters to XSLT templates!
Then I could probably use XSLT for everything and stop using javascript entirely.
But oh well, looks like browser support for XSLT is indeed limited to being "static"
and simply processing server responses,
while dynamic parts require Javascript or server-side scripting...
But where's fun in that?

[for-each]: https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/for-each
[xsl-sort]: https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/sort
[xsl-if]: https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/if
[xsl-choose]: https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/choose
[xsl-functions]: https://developer.mozilla.org/en-US/docs/Web/XPath/Functions
[xsl-sort-w3]: https://www.w3schools.com/xml/xsl_sort.asp

And here's the result - visually it's totally indistinguishable from the [previous version][old][^old]!
Apart from the "Last update" timestamp in top-right corner...
That's because Atom feed spec **requires** feed to include an "updated" timestamp
(presumably for readers to stop processsing a feed if it didn't change),
so I had to add the feature of updating the last built timestamp to lazyblog...
But then, why not show it in HTML, too?
It adds a bit of anxiety, though:
now I know that I can't do some change quietly,
hoping that none will notice it -
this timestamp will tell everyone that _something_ changed there recently...
And for those who check my blog regularly
(let's pretend there are people like this):
they will also see it as "_something_ changed since your last visit",
but might not see what exactly, and left wondering what they missed...
The only people who _might_ benefit from it are those who
use actual RSS feed reader programs, because these programs might highlight the modified entries to them.

[old]: my-blog-is-also-rss-feed.htm
[^old]: previous version preserved here just for reference, won't be updated in a future.

The only thing that I don't like is that in [previous version][prev],
index template page was a 70-lines file, almost completely "plain HTML", with just some `$template_placeholders`,
while in new version this HTML is smeared among 300 lines of XML...
But oh well, what can we do?
XSLT also supports [`document()`][xsl-document] function to load and parse an external document,
which I already use to support different languages,
so maybe I could use **that** to load one more file -an XHTML template,
and then XSLT "program" will simply fill placeholders inside it?..
Too bad there are no built-in template manipulation functions in XSLT.
Even Linux command line [has it][envsubst]!
Although since 2003, according to Copyright note in the above page,
while XSLT 1.0 (the latest version supported by web browsers),
according to [this page][xslt-1.0],
was finalized in 1999,
so someone might argue that XSLT _predates_ `envvsubst`, and my argument is wrong,
but come on! XSLT is _itself_ a templating language!

[prev]: https://github.com/Lex-2008/lazyblog/blob/0f6bda9092222b121cf09efe99fccfba5bf78677/.index-template.html
[xsl-document]: https://developer.mozilla.org/en-US/docs/Web/XPath/Functions/document
[envsubst]: https://man7.org/linux/man-pages/man1/envsubst.1.html
[xslt-1.0]: https://www.w3.org/TR/xslt-10/

Would I recommend anyone to do the same?
Not sure :-)
I would advice you to read through [this comment][browser-comment] first
(note the comment is from 2023,
and author of that comment also created a XSL stylesheet which I linked before -
it is both bigger and more advanced than mine,
so his opinion on this subject should be worth listening even more than mine),
and then I can confirm that in 2024 I've seen it all, too:
Firefox tab freezing if Dev Tools are open,
Chrome being more "picky" (or, rather, strict) about XSLT errors and printing them to terminal[^use-chrome],
but also Chrome inserting two `<br>` elements when asked for one and
having serious performance issues once, until restarted[^chrome-perf].

And yes, debugging indeed feels like back in early 2000s:
`printf` debugging, whole page being blank in case of a single mistake _somewhere_...
So quite often I ended up deleting chunks of XSLT stylesheet
using binary search to find where the error was.

[browser-comment]: https://news.ycombinator.com/item?id=36401854#36403649

[^use-chrome]:
	Actually, because of this, I found it easier to test using Chrome during development,
	because "what works in Chrome will likely work in Firefox, too"
	(but not always the other way around), but also
	because unlike Firefox, Chrome printed these errors _at least somewhere_!
	Although I must admit I didn't try starting Firefox from terminal.

[^chrome-perf]:
	Chrome performance issues might be related to the fact that
	just before that I changed screen scaling back from 125% to 100%
	in display settings, while running under Wayland.
	Firefox picked up the change instantly, while Chrome was still at 125% scale until restart,
	so something is definitely different between them.

Also, turns out, I'm not [the first one][1st] to have RSS feed as the main page!

[1st]: https://curiosity-driven.org/

