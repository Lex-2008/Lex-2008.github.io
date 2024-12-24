title=MacOS autologin password
uuid=2abd4d55-34e6-4c65-a062-cfa99f6317f9
intro=If you need to set it programmatically
tags=mac
style=
styles=
created=2024-11-22
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Originally reverse-engineered by Gavin Brock in 2007
(original website is down, but copy preserved in [archive.org][a]),
and then repeated multiple times, most recently in [tart MacOS sequoia image][b].
Cheers to backwards-compatible XOR security!

[a]: https://web.archive.org/web/20070918005015/http://www.brock-family.org/gavin/perl/kcpassword.html
[b]: https://github.com/cirruslabs/macos-image-templates/blob/master/templates/vanilla-sequoia.pkr.hcl#L98

Here's my attempt at making it into a perl oneliner:

	PASS=newpassword
	perl -e '$a=$ARGV[0]; use POSIX; $l=ceil(length($a)/12)*12; $s=unpack("u","+?8E2(]*\\W>JCN1\\`"); $k=substr($s x $l,0,$l); print $a ^. $k' "$PASS" | sudo tee -a /etc/kcpassword

In more readable format:

	use POSIX
	$a=$ARGV[0]
	$l=ceil(length($a)/12)*12
	$s=unpack("u","+?8E2(]*\\W>JCN1\\`")
	$k=substr($s x $l,0,$l)
	print $a ^. $k

* `$a` is your password, taken from first argument

* `$l` is its length, padded to nearest multiple of 12
  (11->12, 12->12, 13->24, 14->24, etc)

* `$s` is Apple's secret string

* `$k` is encryption key - secret string,
  repeated as necessary and truncated to length `$l`

* Last line performs bitwise XOR between your password `$a` and encryption key `$k`

Note that according to [perlop][p], `^.` operator, when applied to strings,
implicitly appends zero characters to it.
If it's not good enough for you, you can always append zero bytes to the end of `$a`,
like this: `$a=pack("Z" . $l, $a)`.

[p]: https://perldoc.perl.org/perlop#Bitwise-String-Operators`

---

Note that if in addition to having autologin,
you want your user to have an empty password -
then `/etc/kcpassword` file can contain a single `}` character followed by any 11 characters, for example like this:

	echo '}-1-2-3-4-5' | sudo tee /etc/kcpassword

Note that echo adds an extra newline character, so you'll need to add only ten filler characters.
