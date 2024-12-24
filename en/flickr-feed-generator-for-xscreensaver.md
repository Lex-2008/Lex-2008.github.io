title=Flickr feed generator for xscreensaver
uuid=80395f90-a13e-416c-993c-c6edabbb0341
PROCESSOR=Markdown.pl
intro=Helping you to get many big images from flickr to your xscreensaver
tags=bash net linux
created=2016-11-01


Let's say that you're using Linux but envy Windows 10 users who get nice
pictures on their lock screens.
Then, after some googling you will find out that xscreensaver's "hack", as they
call it, called "glslideshow", allows you to show slideshow of images received
over RSS feed, for example, from [Flickr][f].
However, after adding such feed you will notice that it has only 20 images - no
more (To get a nice preview of RSS feed you can open it in Opera browser).
Then you may find [Flickr RSS Feed Generator][dg] from degrave - however, at
least at the moment of writing, it produced feeds with sub-optimal resolution
(you can read about different image resolutions available at flickr
[here][img-url-size]).

In that case, one might consider writing a script which would get list of
photos from [Flickr API][api]. It's quite easy, actually.
And there are three possible solutions:

* you can make a CGI script which will produce RSS feed stub
  enough for xscreensaver to understand
  on demand
  (however if you later add a check for existence of images you reference,
  generation of the feed will take time)

* or run an RSS-generation script every three hours
  (approximate time how often xscreensaver checks for RSS feed update)
  by cron and save output into some file on a server.

* or use a local version and save files into a folder.

In any case you need these two things:

* Get your free API key [here][key].

* Install [jq][] tool
  on a machine (or server) you're going to run the script on.

* * *

First approach - a simple CGI script:

	#!/bin/sh
	
	KEY="<PASTE YOUR KEY HERE>"
	echo 'content-type: text/plain'
	echo
	echo "<?xml >"
	wget -O- "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=$KEY&group_id=23854677%40N00&format=json&nojsoncallback=1" | jq -c .photos.photo[] | sed 's|.*"id":"\([^"]*\)".*"secret":"\([^"]*\)".*"server":"\([^"]*\)".*"farm":\([0-9]*\).*|<item><link rel="enclosure" href="https://farm\4.staticflickr.com/\3/\1_\2_h.jpg">|'

Note that produced stuff is not valid RSS, but rather minimum enough for
xscreensaver to understand.

Also note that I've hardcoded the group ID in the script - it's ID of [Flickr
landscape][group] group.

[f]: https://www.flickr.com/services/feeds/
[dg]: http://www.degraeve.com/flickr-rss/
[api]: https://www.flickr.com/services/api/
[key]: https://www.flickr.com/services/apps/create/apply
[jq]: https://stedolan.github.io/jq/
[img-url-size]: https://www.flickr.com/services/api/misc.urls.html
[group]: https://www.flickr.com/groups/landcape/

However, for some images `_h` version might not exist. So we should filter them
out.  You can either do some fancy arithmetics with creation date, or just
check existence of each file. For this, you check headers of each URL with
`curl -I` and grep for redirect to "unavailable" image. So the script looks
like this:

	#!/bin/sh
	
	KEY="<PASTE YOUR KEY HERE>"
	echo 'content-type: text/plain'
	echo
	echo "<?xml >"
	wget -O- "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=$KEY&group_id=23854677%40N00&format=json&nojsoncallback=1" 2>/dev/null | jq -c .photos.photo[] | sed 's|.*"id":"\([^"]*\)".*"secret":"\([^"]*\)".*"server":"\([^"]*\)".*"farm":\([0-9]*\).*|https://farm\4.staticflickr.com/\3/\1_\2_h.jpg|' | sed 's!.*!curl -I "&" 2>/dev/null | grep -l "Location: .*unavailable" >/dev/null || echo "<item><link rel=\\"enclosure\\" href=\\"&\\">"!' | sh

* * *

If you want the script to generate the feed once every three hours,
stick it to cron like this:

	7 */3	* * *	~/flickr.sh

(Then it will run at 0:07, 3:07, 6:07, etc - :07 part is important to leverage load on flickr API and you machine)

And edit the script to put output into a file:

	#!/bin/sh
	
	KEY="<PASTE YOUR KEY HERE>"
	DST="/var/www/flickr.rss"
	echo "<?xml >" >"$DST"
	wget -O- "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=$KEY&group_id=23854677%40N00&format=json&nojsoncallback=1" 2>/dev/null | jq -c .photos.photo[] | sed 's|.*"id":"\([^"]*\)".*"secret":"\([^"]*\)".*"server":"\([^"]*\)".*"farm":\([0-9]*\).*|https://farm\4.staticflickr.com/\3/\1_\2_h.jpg|' | sed 's!.*!curl -I "&" 2>/dev/null | grep -l "Location: .*unavailable" >/dev/null || echo "<item><link rel=\\"enclosure\\" href=\\"&\\">"!' | sh >>"$DST"

Such feed is available by this link:
`http://alexey.shpakovsky.ru/upload/flickr.rss`
(updates every three hours).

* * *

Local version of the script, which drops files in a folder, looks like this:

	#!/bin/sh
	
	KEY="<PASTE YOUR KEY HERE>"
	DST="/tmp/flickr"
	mkdir -p "$DST"
	cd "$DST"
	wget -O- "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=$KEY&group_id=23854677%40N00&format=json&nojsoncallback=1" 2>/dev/null | jq -c .photos.photo[] | sed 's|.*"id":"\([^"]*\)".*"secret":"\([^"]*\)".*"server":"\([^"]*\)".*"farm":\([0-9]*\).*|https://farm\4.staticflickr.com/\3/\1_\2_h.jpg|' | wget -q --max-redirect 0 -nc -i-
	find * -mtime +1 -exec rm {} \;

Note that instead of `curl -I` to check for file existence and `sed | sh` trick
to generate a script from a set of URLs and run it,
here we just pass the list of URLs to wget.
`-i-` means "read list of URLS from stdin",
`--max-redirect 0` means "don't follow redirects" --
this way we avoid downloading "this image is not available" placeholder images,
since they are implemented as redirects.

Note that last line deletes files older than 2 days.
You can stick it into cron, the same way as you do in second case.
