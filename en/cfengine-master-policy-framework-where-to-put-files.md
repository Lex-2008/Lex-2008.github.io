title=CFEngine Master Policy Framework where to put files
uuid=78036abc-a7f2-4066-b6bc-82d83551ced5
PROCESSOR=Markdown.pl
intro=That was a google query I struggled to find answer to
tags=CFEngine
created=2017-02-09

Full discussion is available [on Google Groups][gg], but **TL;DR** is like this:

* Add this line into your `def.json` file:

		{ "classes": { "services_autorun": ["any"] } }

* Save your custom policies as `services/autorun/*.cf`

[gg]: https://groups.google.com/forum/#!topic/help-cfengine/cYtjzIIBf30
