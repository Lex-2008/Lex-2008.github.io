title=How to selectively clean history in Opera browser
PROCESSOR=Markdown.pl
intro=For example, to delete browsing history of a website
tags=opera
created=2016-08-23
modified=2016-12-11
modified_now=1


Let's say, for example, that you want to delete all _facebook_ entries from
browser history at your work.
To do this:

1. Open history page (Ctrl+H on Win, or button on navigation bar)

2. Type `facebook.com` in search field

3. Open javascript console (Ctrl+Shift+C) and paste this:

		setInterval(()=>{document.querySelector('history-element').shadowRoot.querySelector('.delete').click()},100)

And see all your history items disappear!
