title=Bluetooth Pairing Keys Location
PROCESSOR=Markdown.pl
intro=In case you need to switch between various OSes (be it Windows and Linux, or just various Linux distros).
tags=windows linux bluetooth
created=2021-07-25

On Linux:
--------

	/var/lib/bluetooth/[MAC address of Bluetooth]/linkkeys

you can as well just copy whole `/var/lib/bluetooth` directory.

On Windows:
----------

Inside the registry:

	HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\BTHPORT\Parameters\Keys

Note that to read it you need to run regedit this way:

	psexec -s -i regedit.exe

And for that you need to download PsExec from [sysinternals][si].

[si]: http://technet.microsoft.com/en-us/sysinternals/bb897553.aspx

More details at [this][] stackexchange answer.

[this]: https://unix.stackexchange.com/questions/255509/bluetooth-pairing-on-dual-boot-of-windows-linux-mint-ubuntu-stop-having-to-p
