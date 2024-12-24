title=How to make dark theme follow system theme on some websites
uuid=badeaf26-18cb-4ad1-a678-25a870c21296
intro=If you happen to often switch between "dark" and "light" color themes on your system, you might be lucky enough that your browser picks it up properly and conveys to web sites
tags=javascript
style=
styles=
created=2024-08-06
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Some web sites (like for example this one, [mdn][] and many others) have "light" and "dark" color schemes and automatically change it as soon as broweser reports system color scheme change. Nice!

[mdn]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme

Other web sites (like for example [Hacker News][hn], [SquirrelMail][sq], [CMake documentation][cm], and many others) don't have a dark theme at all.
Boo!
You might consider using [Dark Reader][dr] to give them a dark theme.

[hn]: https://news.ycombinator.com/
[sq]: https://squirrelmail.org/
[cm]: https://cmake.org/cmake/help/latest/
[dr]: https://darkreader.org/

But there is a third kind of web sites: which do have both "light" and "dark" themes, but don't switch them automatically.
To help them, you usually can write some [userscript][] which will automate theme switching.
This page is a collection of such userscripts.
To use them, simply install [User JavaScript and CSS][uJSCSS] extension for Chrome.
You might also import [this file][json] which has all these userscripts enabled, into the extension.

[userscript]: https://en.wikipedia.org/wiki/Userscript
[uJSCSS]: https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld
[json]: how-to-make-dark-theme-follow-system-theme-on-some-websites.json


Slack
-----

Has an option for light/dark color scheme to follow system not on Linux.
On Linux, you can use this script:

````
function setTheme(name) {
	console.warn(name);
	document.querySelector('button[data-qa="user-button"]').click();
	Array.from(document.querySelectorAll('button[data-qa="menu_item_button"]')).at(-2).click();
	setTimeout(() => {
		document.getElementById('themes').click();
		document.querySelector('input[name="theme-mode-radio"][value="' + name + '"]').click();
		document.querySelector('button[data-qa="sk_close_modal_button"]').click();
	}, 0);
}

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

const setColorScheme = (e) => {
	console.warn('setColorScheme');
	if (e.matches) {
		setTheme('dark');
	} else {
		setTheme('light');
	}
};

colorSchemeQueryList.addEventListener('change', setColorScheme);
````

Google Search
-------------

Detects color scheme only on page load.
Hence, reload the page on color scheme change:

````
const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

colorSchemeQueryList.addEventListener('change', () => {
	location.reload();
});
````

Google Mail
-----------

````
let items = [];
function clickr(n) {
	const item = document.querySelector(items[n]);
	if (!item)
		return setTimeout(() => {clickr(n);}, 10);
	item.click();
	if (n + 1 < items.length) clickr(n + 1);
}

function setTheme(name) {
	console.warn(name);
	items = [
		'a[aria-label="Settings"]',
		'button[aria-label="View all"]',
		'div[aria-label="' + name + '"]',
		'span[aria-label="Close"]',
	];
	clickr(0);
}

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

const setColorScheme = (e) => {
	console.warn('setColorScheme');
	if (e.matches) {
		setTheme('Dark');
	} else {
		setTheme('Default');
	}
};

colorSchemeQueryList.addEventListener('change', setColorScheme);
````

