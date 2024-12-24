title=rss
intro=If someone wants to be notified about new posts in my blog via RSS, they can use a simple RSS generator
tags=meta links
style=
styles=
created=2024-11-12
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde
uuid=1797324a-639b-4897-a19c-849b264fe1be

I was able to find two sites which worked for me and didn't require registration:

* **[fivefilters.org][ff]**: [feed link][y]
	The issue with this is that in free version it generates a feed that has only five (latest modified) items.

[ff]: http://createfeed.fivefilters.org/index.php?url=http%3A%2F%2Falexey.shpakovsky.ru%2Fen%2F&item=main+li&item_desc=p&item_date=time
[y]: https://createfeed.fivefilters.org/extract.php?url=https%3A%2F%2Falexey.shpakovsky.ru%2Fen%2F&item=main+li&item_desc=p&item_date=time

* **feedmaker.fly.dev**: [feed link][x]
	The issue with this is that it generates items without date stamps, so they all will be edited "right now".

[x]: https://feedmaker.fly.dev/feed?url=http%3A%2F%2Falexey.shpakovsky.ru%2Fen%2F&selector_item=main+li&selector_title=a&selector_description=p&selector_link=a

Pick your poison
