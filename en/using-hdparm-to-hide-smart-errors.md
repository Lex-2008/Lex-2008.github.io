title=Using hdparm to hide S.M.A.R.T. errors
intro=TL;DR: <code>sudo hdparm --repair-sector <i>SECTOR</i> <i>/dev/sdx</i></code>
tags=linux
created=2020-08-21

Intro
-----

If S.M.A.R.T. self-tests started failing on you (you're both running and monitoring them, are you?), you might try to force drive to _relocate_ it.
Note that proposed method is **destructive**, meaning whatever was written in this sector is erased with zeros.
It can be contents of some file, filesystem structure, etc.
Hence, think about preserving your data first!
If you care about it, ofc.
Hopefully your filesystem supports data checksums, you have backups, and they're located on a filesystem that supports data checksums.

Problem
-------

Let's consider, for example, that output of `sudo smartctl -a /dev/sda` has this snippet, among others:

	<…>
	SMART Self-test log structure revision number 1
	Num  Test_Description    Status                  Remaining  LifeTime(hours)  LBA_of_first_error
	# 1  Extended offline    Completed: read failure       90%      5196         318795064
	# 2  Short offline       Completed without error       00%      5194         -
	<…>

Here you can clearly see that:

a) Offline test ended with read failure;

b) It happened at LBA (sector) number 318795064.

Probably this happened due to some local problem on the surface of harddisk platter.

Solution
--------

To force drive into discarding this surface location and use some reserve space for this LBA sector, issue this command:

	sudo hdparm --repair-sector 318795064 --yes-i-know-what-i-am-doing /dev/sda

where 318795064 is that number from `smartctl` output, and `/dev/sda` is the disk name.

Once again, friendly reminder that it will overwrite this sector with zeros, wiping whatever was stored there previously.

Also worth noting that sometimes surface problems span several LBA sectors, so you might want to run the above `hdparm` command for several consecutive sectors, starting from the one mentioned in `smartctl` output.

To test disk surface starting from specific LBA sector, you can use the following command:

	smartctl -t select,318795064-max /dev/sda

[This][so] StackOverflow answer has a nice script automating this loop of "find bad sector - overwrite it with 0s - repeat".

[so]: https://serverfault.com/a/641135
