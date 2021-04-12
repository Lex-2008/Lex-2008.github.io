title=Browser security on Linux
intro=A Linux.com article I totally agree with
tags=Linux security
created=2017-05-10

A good article that summarizes my own thoughts on hardening browser on Linux:

[4 Best Practices for Web Browser Security on Your Linux Workstation](https://www.linux.com/news/linux-workstation-security/2017/5/4-best-practices-web-browser-security-your-linux-workstation) [(archived copy)](/cache/browser-security-on-linux.html).

tl;dr version is like this:

> 1. Use different browsers for "trusted" websites and "rest of the world"
> 
> 2. Use [firejail][]
> 
> 3. Isolate "trusted" and "others" graphic environments from each other.

[firejail]: https://firejail.wordpress.com/

There is one thing I'd like to highlight, however: it's not your trusted browser you should put into a firejail sandbox, but an "untrusted" one. Because otherwise malicious apps, sitting in an untrusted browser, will be able to access your whole system, incluiding the sandboxed "trusted" browser.

I'd also consider using a separate machine for banking websites :-)
