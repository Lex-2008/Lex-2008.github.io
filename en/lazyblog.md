title=lazyblog
PROCESSOR=Markdown.pl
intro=a static blog generator which tries to do as little as possible on the server side
tags=bash javascript
created=2016-12-14


Few years ago I switched my website to [bashblog][bb] and was very happy.
But with time, as number of posts was growing,
bashblog began being slower and slower,
especially in "edit" mode.
Reason, as I think, was 'all_posts' page, which was regenerated every time anew,
and many tag pages (many tags on each page times many pages on each tag equals long rebuilding time),
and every single time script had to open each post page to read title (and maybe some text) from it.
Not very good.

[bb]: https://github.com/cfenollosa/bashblog

So I decided to try a different architecture:

* instead of regenerating the index page anew, script patches it -
  this would require having some expected markup in the index page

* instead of having separate pages for each tag, javascript is used to filter shown posts -
  this change will be completely incompatible with bashblog, which aims to use no javascript at all

* since we're talking javascript - it would be nice to have everything on one 'index' page, instead of having separate 'index', 'all\_posts', 'all\_tags', and 'tag\_*' pages, requiring a lot of clicks to navigate

* search would also be a nice addition

* and ability to change template a bit more freely than in bashblog

That's how lazyblog was born.

* index page has special `<!-- begin ... -->` ... `<!-- end ... -->`
  comments surrounding each post,
  which let `sed` easily find and delete needed part.

* at the top of index page there is a `<!-- content starts here -->`
  comment which lets `sed` easily find a place to put new post content to.

* sorting is done by javascript on the client side,
  so it's nothing for bash script to care.

Result? bash script speed is pretty impressive - it processes each file in almost no time
(the longest part is actually markdown processor).
Client-side performance also tries to be as fast as possible,
especially during page load
(expensive DOM operations and rendering of below-the-fold content is delayed).

Actually, the hardest-to-optimize part was extracting data (post titles and tags)
from the actual webpage - turns out, the fastest way was just to create
many special `<div>` tags and extract data from them.
Other ways (including using regular expressions) are left in [script.js.bak][bak]
in repository.

There is also a `bb-import.sh` script which imports posts from a bashblog installation,
assigning proper dates, tags, title, and sometimes intro text
(although manual correction sometimes is needed).

Github link: <https://github.com/Lex-2008/lazyblog>

[bak]: https://github.com/Lex-2008/lazyblog/blob/master/script.js.bak
