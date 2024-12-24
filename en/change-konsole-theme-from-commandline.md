title=Change Konsole theme from command-line
uuid=1cd3908c-fd05-4b61-bbfd-7bc6c0fdc581
intro=If you happen to often switch KDE desktop themes and work in konsole (KDE terminal emulator) a lot, you might want to switch konsole color schemes, too. Instead of messing with "Manage Profiles" dialog and changing profile for each open konsole tab every time, you might want to automate it a bit
tags=linux
style=
styles=
created=2024-07-30
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Unfortunately, it seems you can't easily change _color schemes_ assigned to profiles,
but you can switch entire profiles
(color scheme is only a part of profile, other options that are stored in profile include size of scrollback, default shell, keybindings, and many others).
That's better than nothing!

One user recently [posted][post] a working script which automates switching active profile: both default profile which is active on new konsole tabs/windows, and walking through all open konsole tabs/windows and changing profile there, too.
Nice!

My (slightly modified) version is below:

	#!/bin/sh
	# Change Konsole color scheme
	# from https://discuss.kde.org/t/how-do-i-make-konsole-follow-system-theme/933/10

	PROFILE_NAME="${1:-FALLBACK}"

	## Change Konsole default profile color scheme
	kwriteconfig6 --file konsolerc --group "Desktop Entry" --key DefaultProfile "$PROFILE_NAME.profile"

	## slight delay to compensate for theme switching animation
	sleep 0.3

	## Apply the new Konsole profile to all open Konsole windows
	### Get list of all Konsole services
	KONSOLE_SERVICES=$(qdbus org.kde.konsole*)

	### Apply the new profile to all windows and their sessions/tabs
	for service in $KONSOLE_SERVICES; do
		SESSIONS=$(qdbus $service | grep -oP '/Sessions/\d+')
		for session in $SESSIONS; do
			qdbus $service $session setProfile "$PROFILE_NAME"
		done
	done

Run it, passing it a single argument: name of profile you want to use.
Use Konsole "Manage Profiles" dialog to create new profiles.


For example, save it in a `kterminal-profile-change` file somewhere on your `$PATH`,
and
create two profiles in konsole,
call them "light" and "dark",
then
install [Day/Night Switcher][store] applet,
and paste the following commands to be executed on switching color schemes to bright and dark:

````
kterminal-profile-change light
````

````
kterminal-profile-change dark
````

I also like changing icons to "weather-clear" and "weather-clear-night",
as suggested by one of [comments][].


[post]: https://discuss.kde.org/t/how-do-i-make-konsole-follow-system-theme/933/10

[store]: https://store.kde.org/p/1804745

[comments]: https://store.kde.org/p/1804745#product-comments
