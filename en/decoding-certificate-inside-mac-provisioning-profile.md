title=Decoding certificate inside Mac provisioning profile
uuid=7dcaad6e-3ab2-4bb2-9d94-0136b91fc780
intro=Small script to help you debug this crypting xcodebuild error: exportArchive: Provisioning profile "XXX" doesn't include signing certificate "YYY"
tags=Mac bash
style=
styles=
created=2024-10-18
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

	test -z "$1" && echo "no filename?" && exit 1

	name="${1%.*}"
	set -ex

	security cms -D -i "$1" -o "$name.plist"
	plutil -extract DeveloperCertificates xml1 -o - "$name.plist"
	plutil -extract DeveloperCertificates.0 raw -o - "$name.plist" | base64 -D >"$name.cert0.cer"
	certtool d "$name.cert0.cer" >"$name.cert0.txt"
	grep Common "$name.cert0.txt"

Pass it a path to `*.provisionprofile` file, and it will create some more files next to it, and print some info at the end.

Note the blob of XML returned by `plutil -extract DeveloperCertificates xml1 ...` command - if it has more than one section
(never happened to me) - you might need to edit rest of script to check other certificates, too, not only the first (0th) one.

Also note that last `grep Common ...` command prints certificate names from trust chain, including your certificate name, too.
This is the certificate name that is actually included in the provisioning profile

Based on and more info: <https://developer.apple.com/documentation/technotes/tn3125-inside-code-signing-provisioning-profiles> ([cached version](https://archive.is/z0CUy))
