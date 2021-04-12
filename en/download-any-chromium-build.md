title=Download any Chromium build
intro=Is it hard to download any Chromium build?
tags=python chromium
created=2014-03-27
modified=2016-06-16
modified_now=1


Taking in account that:

* Google stores old versions of Chromium browser in [several](http://commondatastorage.googleapis.com/chromium-browser-continuous/) [repositories](https://storage.googleapis.com/chromium-browser-snapshots/).
* These pages are built by AJAX scripts which load contents progressively.
* Builds are saved in folders using revision numbers from Chrome CVS, but luckily [omahaproxy](http://omahaproxy.appspot.com/) has an JSON service to get revision number from a version number.
* However, not all versions exist in these repos. So we'll check nearest versions (plus-minus 1, 2, etc)

We can make a function like this:

	import json
	import re
	import string
	import sys
	import urllib2
	
	def get_best_URL_for_version(version):
		platforms = {'win32':0, 'cygwin':0, 'darwin':1}
		version_to_revision_url = 'http://omahaproxy.appspot.com/revision.json?version=%s'
		storages = [
				{
					'url': 'http://commondatastorage.googleapis.com/chromium-browser-continuous/',
					'filters': [
						['?delimiter=/&prefix=Win/','?delimiter=/&prefix=Win_x64/'],
						['?delimiter=/&prefix=Mac/'],
					],
				},
				{
					'url': 'https://storage.googleapis.com/chromium-browser-snapshots/',
					'filters': [
						['?delimiter=/&prefix=Win/','?delimiter=/&prefix=WinGit/'],
						[], # these use SHAs as folder names :(
					],
				},
			]
		chromium_install_filename = [
				'chrome-win32.zip',
				'chrome-mac.zip',
			]
		platform_id = 0
		if not sys.platform in platforms:
			print 'Sorry, platform [%s] is not supported by this script' % sys.platform
			return None
		else:
			platform_id = platforms[sys.platform]
		print 'Loading all repos...'
		global revisions
		revisions = {}
		def parse_url(url, filter, marker=''):
			global revisions
			if marker:
				marker = '&marker=' + marker
			print 'Reading [%s]' % (url+filter+marker)
			data = urllib2.urlopen(url+filter+marker).read()
			for match in re.finditer('\<Prefix\>([a-zA-Z]+/(\\d+)/)\</Prefix\>', data):
				revisions[int(match.group(2))] = (
					url + match.group(1) + chromium_install_filename[platform_id])
			if string.find(data, '<IsTruncated>true</IsTruncated>')>-1:
				match = re.search('\<NextMarker\>([^<]*)\</NextMarker\>', data)
				if match:
					parse_url(url, filter, match.group(1))
				else:
					print 'BUG! IsTruncated, but no NextMarker'
		for storage in storages:
			url = storage['url']
			for filter in storage['filters'][platform_id]:
				parse_url(url,filter)
		print 'Finding closest version...'
		def change_version(version, adjust):
			def version_string_to_array(version):
				return map(int,version.split('.'))
			def array_to_version_string(version):
				return '.'.join(map(str,version))
			version = version_string_to_array(version)
			version.reverse()
			for i, a in enumerate(version):
				if a != 0:
					a += adjust
					if a>0:
						version[i] = a
						break
					else:
						# when asked to adjust 1234.5 by -6 then instead of 1234.(-1)
						version[i] = 0 # 1234.0
						adjust = a     # (1234-1).0
			version.reverse()
			return array_to_version_string(version)
		adjust = 0
		while True:
			for sign in [1, -1]:
				url = version_to_revision_url % change_version(version, sign*adjust)
				print "checking %s" % url
				revision = None
				try:
					revision = json.load(urllib2.urlopen(url))['chromium_revision']
				except urllib2.HTTPError:
					pass
				if revision in revisions:
					return revisions[revision]
			adjust += 1

It first loads all the repos and builds a list of revisions and matching URLs, and then scans all versions, starting with given one, trying to find a closest version which exists in this list.
You can use it like this:

		if __name__ == "__main__":
			print get_best_URL_for_version(raw_input('Enter Chromium version to find (f.ex 34.0.1788.0): '))

<script src="/microlight.js"></script>
