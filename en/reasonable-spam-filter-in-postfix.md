title=Reasonable spam filter in Postfix
intro=One of reasons why people switch from sendmail to postfix is ease of configuration.
tags=linux e-mail
created=2021-07-19

In my case, for [sendmail][sm] I had a spam filter like this:

[sm]: whitelisting-emails-with-sendmail.html

> * messages from contacts in my address book should go to inbox,  
>
> * other messages should go to the spamfilter
>
> * (and if they pass it - to trash)

However, I wanted to add an extra exclusion for sites where I registered with email like `user+tag@example.com`.
That was pretty hard to achieve with sendmail (and what's worse, I didn't completely understand what I was doing),
so together with [containerisation][cont] I decided to switch from sendmail to postfix.

[cont]: https://github.com/Lex-2008/containers

And it went well!
Moreover, I could also configure it to use both "plus" and "minus" characters as _recepient delimiters_
(symbols staying between "user" and "tag" in `user+tag@example.com`),
so now I can register as `user-tag@example.com` on websites which don't allow "plus" characters in email.

As a result, my current spam filter looks like this:

> * messages from contacts in my address book and those sent to emails containing "plus" or "minus" should be excluded from spamfilter,
>
> * other messages should be checked against DNSBL.
>
> * Messages from contacts in my address book should go to inbox,  
>
> * other messages (which passed or were excluded from spamfilter) should go to trash.

And it was done with this rather readable postfix config [entry][e]:

	smtpd_recipient_restrictions = permit_mynetworks,      # allow mail sent from local addresses
	  permit_sasl_authenticated,                           # allow mail sent by authenticated users
	  unauth_destination,                                  # reject mail sent to other domains
	  unlisted_recipient,                                  # reject mail sent to non-existent users
	  ender_access texthash:/data/conf/known-senders.txt,  # allow mail sent by known senders
	  ecipient_access regexp:/data/conf/delimeters.txt,    # allow mail sent to addresses with + or -
	  rbl_client rbl.rbldns.ru                             # check other messages against DNSBL
	                                                       # allow messages which pass DNSBL check

[e]: https://github.com/Lex-2008/containers/blob/master/postfix.cont/data/conf/main.cf#:~:text=smtpd_recipient_restrictions

Rules are processed from top to bottom, first matching rule "wins".

List of messages which didn't pass this filter you can find on [separate page][sp].

[sp]: spam-emails.html

That's all about allowing or rejecting messages.
For sorting messages to inbox or trash, I'm using Sieve plugin built into dovecot, but that's a different story.

And how does **your** spam filter work?
Are you sure it's not rejecting messages from your friends?
Are you sure it will not reject a message from a website you're going to register at?
Do you have any control over it?
Feel free to let me know!
Link to my email is at the bottom of this page
(and now you know how to ensure it will pass my spam filter, he-he).
