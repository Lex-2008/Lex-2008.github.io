title=totp
uuid=cac6ee37-e458-490d-870b-0e4aa88ee923
intro=A small shell script to generate one-time passwords, in bash, using oathtool
tags=bash
style=
styles=footnotes
created=2022-09-05
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

First, save all your TOTP shared secrets in a file, formatted like this:

	<provider_name>	<secret>
	<another_provider>	<secret>

i.e. one entry per line, provider name and relevant secret, separated by space or tab symbols;
provider name should **not** contain spaces, for example like this:

	Google  3TAPFH5S6QXRVAZZF5FUXUXXRZKWU74J
	Slack   4IGIS2QZGVQAKG4GFNMFE6ZMOR3JHJUQ
	GitHub  OUZKAXEKC44GPAPF6CTCCQFWCMC77KKJ

Extracting secrets from QR codes is left as exercise to a reader :)

I recommend storing them in a password-protected area, encrypted by gpg or encfs, for example.
Setting up such storage is left as exercise to a reader ;)

Then, edit the following script, changing the first command to the one which decrypts the above file
and prints out its (unencrypted) contents.
For example, for GPG it will be something like `gpg --decrypt /path/to/file.gpg`,
for encfs - `encfsctl cat /path/to/encfs/dir path/inside/encfs.txt`.
In my case, I have encfs dir in my home dir (`~/secrets`),
and file with totp secrets inside it is called `totp.tsv`:

````
#!/bin/bash
times="$(seq 0 30 300)"
{
	encfsctl cat ~/secrets totp.tsv | while read -r name key; do
		echo -n "$name"
		for n in $times; do
			echo -n " $(oathtool -b --totp "$key" -N "$n"sec)";
		done
		echo
	done

	startdate=$(( `date +%s` / 30*30 ))
	echo -n 'valid_from:'
	for n in $times; do
		echo -n " $(date +:%M:%S -d @"$(( $startdate + $n ))")";
	done
	echo

	echo -n 'valid_till:'
	for n in $times; do
		echo -n " $(date +:%M:%S -d @"$(( $startdate +30+ $n ))")";
	done
	echo

} | column -t

echo "time left: $(( 30 - `date +%s` % 30 ))s until first column expires"
````

After that, put your version of script somewhere in your `$PATH`
(on many distros, `$PATH` already contains something like `$HOME/bin` or `$HOME/.local/bin`,
so you can use it), and run it like this:

	$ totp
	EncFS Password: 
	Google       861915  884175  782047  363025  564419  385283  593464  678348  872068  302381  188625
	Slack        704518  285105  451670  516415  791460  963257  000631  457236  873156  305617  888663
	Github       473426  496830  638103  390175  242689  421850  929121  868693  287511  046614  269728
	valid_from:  :17:00  :17:30  :18:00  :18:30  :19:00  :19:30  :20:00  :20:30  :21:00  :21:30  :22:00
	valid_till:  :17:30  :18:00  :18:30  :19:00  :19:30  :20:00  :20:30  :21:00  :21:30  :22:00  :22:30
	time remains: 12s until first column expires

Assuming that current time is 16:17:18, output reads like this:

* for every provider, you see several OTP values - for current 30-second interval[^30sec] and for few in the future

* after that, `valid_from` and `valid_till` lines show timeframe when codes in each column are valid. Note that time is shown is _minutes_ and _seconds_.

* last line shows how many seconds you have until first column expires

[^30sec]: I assume you know how TOTP works?

Feel free to use and improve this script however you want!
