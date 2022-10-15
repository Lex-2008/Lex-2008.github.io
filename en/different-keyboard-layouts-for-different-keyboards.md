title=Different keyboard layouts for different keyboards
PROCESSOR=Markdown.pl
intro=On Linux, you can have different keyboard layouts for different physical keyboards. How? Easy!
tags=Linux
created=2017-03-14

Just add a line like this:

	SUBSYSTEM=="input", ACTION=="add", ENV{ID_SERIAL}=="046a_0011", ENV{XKBLAYOUT}="us,ru", ENV{XKBVARIANT}=",winkeys", ENV{XKBOPTIONS}="grp:shift_caps_switch,grp_led:caps,terminate:ctrl_alt_bksp"

to your `/etc/udev/rules.d/zz-local.rules` file (create it if it doesn't exist).

Note that I haven't tested it under SystemD or Wayland.
Sway, [it seems][sway], supports it natively!

[sway]: https://wiki.archlinux.org/title/Sway#Keymap
