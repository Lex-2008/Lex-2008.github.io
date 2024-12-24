title=csv2vcf (or rather tsv2vcf)
uuid=38e1aa7f-3752-4919-bb0a-d22c0388e843
intro=If you're (un)lucky and your employer stores all employees' contact data in a spreadsheet (instead of vcards or not giving you easy access to it at all), you can easily convert it to VCF (VCard Format file) and upload to your private WebDAV server! How? Pretty easy
tags=bash
style=
styles=footnotes
created=2022-06-20
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

First, export spreadsheet to a _tab-separated file_ (TSV)[^tsv].

[^tsv]: TSV is like CSV (Comma-separated file), but easier - instead of using commas to separate values, it uses tab characters, so doesn't have a problem with escaping the separator character.

Second, decide what fields you are interested in.
To make `sed` script easier, consider limiting yourself to only 9 fields in source table
(you can juggle them as much as you want in the resulting VCF).

Third, amend the following script:

````
#!/bin/sh

sed='s|([^\t]*)\t([^\t]*)\t?([^\t]*)\t?([^\t]*)\t?([^\t]*)\t?([^\t]*)\t?([^\t]*)\t?([^\t]*)\t?([^\t]*)|\
BEGIN:VCARD\
VERSION:3.0\
FN:\2 \1\
N:\1;\2;;;\
EMAIL;TYPE=INTERNET;TYPE=WORK:\3\
ADR;TYPE=home:;;\4;;;;\
TEL:\5\
PHOTO;TYPE=JPEG;VALUE=URI:\6\
BDAY:2023-\7-\8\
EMAIL;TYPE=INTERNET;TYPE=HOME:\9\
CATEGORIES:Northern.Tech\
END:VCARD|
s|: *|:|g
s|TEL:00|TEL:+|
s|TEL:([^+])|TEL:+\1|
s|TEL:\+\(\+|TEL:(+|
s|TEL:([^/\n]*) */[^\n]*|TEL:\1|
s|BDAY:2023--\n||
s|BDAY:2023-(.)-|BDAY:2023-0\1-|
s|BDAY:2023-(..)-(.)\n|BDAY:2023-\1-0\2\n|
s|ADR;TYPE=home:;;;;;;\n||
s|TEL:.\n||
s|PHOTO;TYPE=JPEG;VALUE=URI:\n||
s|EMAIL;TYPE=INTERNET;TYPE=HOME:\n||
'

n=1
rm -f path/to/addressbook/*.vcf
sed '1d;2d' file.tsv | cut -f 1-5,18,26-28 | while read -r line; do
	echo "=====$n====="
	echo "$line" | sed -r "$sed" | tee "path/to/addressbook/$n.vcf"
	n=$((n+1))
done
````

Note how sed script takes care of various phone number formattings, and removes empty fields!
Remember to change path to file (`file.tsv`) and the place where you mounted your addressbook (read about it a bit later)! For example, in case of Baikal DAV server, it's something like `~/mountpoint/addressbooks/{user}/{addressbook}/`.
Also note that the script deletes everything in the addressbook -
it's good for updating the addressbook by re-running it from time to time,
but remember not to store any other contacts in the same addressbook!

Run it like this:

````
$ sudo mount.davfs https://dav.server/ ~/mountpoint
$ sudo sh script.sh
````

In case of Baikal, `https://dav.server/` is `https://baikal.server/dav.php`
