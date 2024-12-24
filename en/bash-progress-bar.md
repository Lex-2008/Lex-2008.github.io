title=Progress bar in bash
uuid=434235ad-4cb0-45b1-95b9-197744330d3c
PROCESSOR=Markdown.pl
intro=one-line bash function to draw a nice progress bar
tags=bash
created=2016-04-07
modified=2016-12-12
modified_now=1

If you happen to look at a long running job in bash
(instead of running it in background, like me),
then you might find this function useful.

It accepts two arguments: current position and total length of job
(in arbitrary units)
and prints back them and a progress bar.

It uses the whole width of the screen.

Requirements / dependencies:
`tput` to get screen width and
`bc` for calculations.

	$ function bar() { local COLS="$(tput cols)"; local LEN="$(echo "$COLS-4-${#1}-${#2}" | bc)"; echo -en "\r$1/$2 ["; (eval "printf '#%.0s' {1..$(echo "($1*$LEN)/$2" | bc)}; printf ' %.0s' {1..$COLS}") | head -c $(echo $LEN | bc); echo -en "]\r" ; }
	$ bar 2 12; echo
	2/12 [############                                                             ]
	$
