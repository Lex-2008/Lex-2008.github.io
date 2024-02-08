title=Un-busting GRUB with arch-chroot
intro=properly this time
tags=Linux
style=
styles=
created=2023-08-19
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

1. Boot from [archiso][a] CD/DVD/USB

2. Prepare dir structire - in my case, it was:

		mount /dev/nvme0n1p6 -o subvol=@ /mnt
		mount /dev/nvme0n1p1 /mnt/boot/efi
	
	Hint: to find out proper patition names, you can use `lsblk` and `lsblk -f` commands.

3. `chroot` to it

		arch-chroot /mnt

4. Fix your problem!

		grub-install

Also see "[10 use the power of arch-chroot when your computer crashes][x]".

Remember the `-o subvol=@` thingy to mount the proper subvol!
Otherwise, you'll have to `mount --bind /mnt/@ /mnt/@` before the second `mount` command
(otherwise `grub-install` won't find root filesystem in `/dev`),
and use proper path (`/mnt/@` instead of `/mnt`) in the following commands

[a]: https://archlinux.org/download/
[x]: https://www.arcolinuxd.com/10-use-the-power-of-arch-chroot-when-your-computer-crashes/
