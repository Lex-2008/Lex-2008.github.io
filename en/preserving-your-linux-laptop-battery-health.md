title=Preserving your Linux laptop battery health
uuid=83979026-c380-4b0d-8298-b7f723d27e8a
intro=by limiting its charge to 90%
tags=Linux
style=
styles=
created=2023-11-05
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

If you, like me, use KDE, then in System Settings -> Power Management -> Advanced Power Settings you might've noticed an option to stop charging your battery when it reaches some percentage (and also to start charging only once below some other percentage).
Personally, I've set one of them to 90%, and another one - to 80%.

However, you might've noticed that this setting, while working nicely, seems to be not preserved over reboots.
There is a [closed discussion on Manjaro forums][m] and [an article on ArchWiki][a] about it.

[m]: https://forum.manjaro.org/t/system-settings-advanced-power-settings-charge-limit-is-not-persisting-after-machine-is-shut-down/116560/12
[a]: https://wiki.archlinux.org/title/Laptop/ASUS

From there, you might find a workaround: just make a systemd service to set these settings for you after reboot!

1. Create a file `/etc/systemd/system/battery-charge-threshold.service` with content like this:

		[Unit]
		Description=Set the battery charge threshold
		After=multi-user.target
		StartLimitBurst=0

		[Service]
		Type=oneshot
		Restart=on-failure
		ExecStart=/bin/bash -c 'echo 90 > /sys/class/power_supply/BAT0/charge_control_end_threshold && echo 80 > /sys/class/power_supply/BAT0/charge_control_start_threshold'

		[Install]
		WantedBy=multi-user.target
	
2. Run the following commands to enable it:

		sudo chmod 644 /etc/systemd/system/battery-charge-threshold.service
		sudo systemctl daemon-reload
		sudo systemctl enable battery-charge-threshold.service

3. Enjoy extended life of your laptop battery... maybe... for the price of shorter "laptop life from one charge", hehe
