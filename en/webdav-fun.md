title=Fun with webdav
uuid=9730dd49-f28a-4066-813f-8b35ecebb0ac
intro=Playing with a fancy old technology
tags=nginx
style=
styles=
created=2022-12-20
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Recently I learned about [webdav-js][] - a simple JS script,
which can be used as a bookmark and turn any otherwise [boring-looking][b] HTML directory listing page
into a nice file management web interface.
Note that for that to work, web server needs to support webdav.

[webdav-js]: https://github.com/dom111/webdav-js
[b]: https://webdav.filestash.app/

And turns out, it's pretty easy to enable this support in most web server software!
Here I'll focus on doing in with nginx, since it has this fancy feature of limiting _some_ request _methods_ to authorised-only users.

For example, you can _allow_ only `GET` requests to non-authorised anonymous users.
This way users who have an account can share files with rest of the world.
Even better, you can enable directory listing, or put custom `index.html` files to hide their contents!
All without extra coding, from your browser, just by using webdav!

Relevant part of the config:

	server {
		# listen, server_name, etc...

		root                /var/www/files;
		client_body_temp_path /var/www/.uploads/;
		client_max_body_size 200g;
		# Better to keep `client_body_temp_path` and `root` on the same partition.
		# otherwise client_body_temp_path is on `/tmp` which might be too small
		# for some of your files.

		# tune to your liking
		autoindex           on;
		autoindex_exact_size off;
		charset             UTF-8;

		# enable dav
		create_full_put_path on;
		dav_methods         PUT DELETE MKCOL COPY MOVE;
		dav_ext_methods     PROPFIND OPTIONS;

		# If you don't want to appear in search results
		location /robots.txt { return 200 "User-agent: *\nDisallow: /"; }

		location /          {
			# guests can only GET
			limit_except GET {
				auth_basic "files";
				auth_basic_user_file /path/to/passwd.txt;
			}

			# if desired, you can have custom index.html file on the root,
			# which can't be changed by users
			# location = / { index ../files.index.html; }
		}
	}

This config enables WebDAV on "otherwise boring-looking" HTML directory listing site,
which can be turned into a file manager either by using WebDAV-js bookmark or this simple js-HTML one-line page:

	<script>["https://cdn.jsdelivr.net/gh/dom111/webdav-js/assets/css/style-min.css","https://cdn.jsdelivr.net/gh/dom111/webdav-js/src/webdav-min.js"].forEach((function(e,s){/css$/.test(e)?((s=document.createElement("link")).href=e,s.rel="stylesheet"):(s=document.createElement("script")).src=e,document.head.appendChild(s)}))</script>

Which, basically, is the same bookmark, wrapped in `<script>` tags.

-----

But what if we allow other methods, but forbid `GET`?
Then we can get... A server where anonymous users can _upload_, but **not** download files!
So... A "share files (securely) with me (site owner)" service.

Relevant part of the config then will be:

        location /files/          {
		# enable dav only for this subdir
                create_full_put_path on;
                dav_methods         PUT DELETE MKCOL COPY MOVE;
                dav_ext_methods     PROPFIND OPTIONS;

		# inside this directory, guests can only upload (PUT) files
                limit_except PUT {
                        auth_basic "files";
			auth_basic_user_file /path/to/passwd.txt;
                }

                # some security to protect admins from user-uploaded files
                index /admin.html;
		# directory index file is outside of 
                types { text/plain html htm shtml xhtml mml svg svgz; }
        }

To upload files, you just need to issue a PUT request, using, for example, XMLHTTPRequest from a browser, like this:

	function XHRPutFile (url, file, onProgress) {
		return new Promise((resolve) => {
				const xhr = new XMLHttpRequest();
				$('#progress button').onclick=x=>xhr.abort();
				xhr.upload.onprogress = onProgress;
				xhr.onloadend = () => resolve(xhr);
				xhr.open('PUT', url, true);
				xhr.setRequestHeader('Content-Type', file.type);
				xhr.send(file);
				});
	};

	document.getElementById('file').onchange=async function(e){
		for (file of e.target.files){
			var xhr = await XHRPutFile(`files/${file.name}`, file, loadProgress);
		}};

Full example of webpage is available [here][ex].
Note that it doesn't work here, because this website doesn't have WebDAV enabled :)

[ex]: webdav-fun-drop.html
