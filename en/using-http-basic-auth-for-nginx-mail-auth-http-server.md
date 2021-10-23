title=Using HTTP Basic auth for nginx mail auth http server
intro=How hard can it be? Using only nginx itself!
tags=nginx net
created=2021-10-23

When proxying mail connections (SMTP, IMAP, POP3) to backend, nginx uses [mail\_auth\_http][mail_auth_http] module,
which verifies passwords using HTTP connection to a (potentially external) _auth server_.

In simplest case, without password verification, this server can be implemented in nginx itself and look like this
(example from [serverfault][]):

        server {
                listen 127.0.0.1:2580;
                location = /auth {
                        add_header Auth-Status OK;
                        add_header Auth-Server 127.0.0.1;  # backend ip
                        add_header Auth-Port   2525;       # backend port
                        return 200;
                }
        }

Overall it's nice, since it allows you to control access to your mail server _before_ connection reaches the mail server itself.

But, if you're already using [http\_auth\_basic][http_auth_basic] module to control who can access your _webmail interface_,
you might be wondering: why does mail\_auth\_http use a different scheme for password verification
and shouldn't it be possible to use existing http\_auth\_basic infrastructure for mail\_auth\_http server?

While I don't know _why_ it was implemented that way, I can tell you _how_ to workaround it :)

First, the mail\_auth\_http server receives username and password in `Auth-User` and `Auth-Pass` headers,
while http\_auth\_basic expects to see them _base64_-encoded in Authorization header.

To convert from one format to another, we first use [set\_misc][set_misc] nginx module
which has a base64 encode function, and then set an Authorization header when performing a [proxy\_pass][proxy] _sub_-request:

	load_module modules/ndk_http_module.so; # required for set_misc_module
	load_module modules/ngx_http_set_misc_module.so;

	http {
		server {
			listen 127.0.0.1:14380;
			location /check    {
				set $auth         "$http_auth_user:$http_auth_pass";
				set_encode_base64 $auth; # uses set_misc_module
				set $auth_header  "Basic $auth";
				proxy_pass        http://127.0.0.1:14380/auth;
				proxy_set_header  Authorization $auth_header;
			}
		}
	}

To follow the mail\_auth\_http protocol, this subrequest must (after verifying username and password)
return one of two sets of headers, both with return code 200.
The simplest way I managed to do this in nginx was to make this subrequest an http\_auth\_basic-protected proxy\_pass
(this way authorised requests will go into the third level, which will return proper headers for the "authorised" case),
and rewrite the "401 Unauthorized" error response to custom "unauthorized" level,
which will return proper headers for the "unauthorized" case together with a 200 response code.

	location /auth     {
		# 2nd level - performs HTTP basic auth check and forwards either to /pass or /fail
		auth_basic "imap";
		auth_basic_user_file /data/passwd/mail.txt;
		proxy_pass http://127.0.0.1:14380/pass;
		error_page 401 =200 /fail;
	}
	location /pass     {
		# this sits behind HTTP basic auth above. If request came here - it's authorised.
		add_header Auth-Status OK;
		add_header Auth-Server 127.0.0.1;  # backend ip
		add_header Auth-Port   1433;       # backend port
		return 200;
	}
	location = /fail   {
		# unauthourised requests end up here.
		add_header Auth-Status "try again with a different username and password";
		add_header Auth-Wait 3;
		return 200;
	}

Note that in this example I used simple auth\_basic\_user\_file directive to fetch valid username/password pairs from a file,
but you can also use [auth_request][] here, ref [relevant guide][auth_request_guide].

Relevant mail part of nginx config:

	load_module modules/ngx_mail_module.so;
	mail {
		server {
			listen     143;
			protocol   imap;
			auth_http  127.0.0.1:14380/check;
		}
	}

Note that this example assumes unencrypted connections only,
and you likely don't want to have it like this in production.
Enabling ssl for connections is left as exercise for the reader :)

Full working example you can find on my [github][].


[mail_auth_http]: http://nginx.org/en/docs/mail/ngx_mail_auth_http_module.html
[http_auth_basic]: http://nginx.org/en/docs/http/ngx_http_auth_basic_module.html
[set_misc]: https://github.com/openresty/set-misc-nginx-module
[serverfault]: https://serverfault.com/a/610481
[proxy]: https://nginx.org/en/docs/http/ngx_http_proxy_module.html
[auth_request]: https://nginx.org/en/docs/http/ngx_http_auth_request_module.html
[auth_request_guide]: https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/
[github]: https://github.com/Lex-2008/containers/blob/master/nginx.cont/data/conf/nginx.conf
