title=Auto backup on mount
uuid=a73064f6-478d-4418-9d9b-c53006d5174e
PROCESSOR=Markdown.pl
intro=Automatically backup files on media mount, using usbmount
tags=bash
created=2018-01-22

Assuming you're using WM, not DE, you probably have installed `usbmount` package in order to automatically mount USB sticks and HDDs when they are inserted.

It has nice "autorun" feature which we can use to automatically backup onto some removable harddisks when they are inserted.
Assuming you're familiar with my [rsync backups script][1] (if not, you always can write your own or use plain rsync).

[1]: rsync-backups.html

Simply put this script into `/etc/usbmount/mount.d/`:

    #!/bin/sh

    ROOT=$UM_MOUNTPOINT/backups.auto
    test -d $ROOT || exit 0

    export ALLOW_FIRST_RUN=1
    export CLEAN_DIRS=$ROOT/*
    export IGNORE_23=1

    /root/backup-script.sh /home/ $ROOT/`hostname`

    sync
        
Now, if inserted drive has `backups.auto` dir with a subdir matching your machine's hostname, it will be used to keep incremental backups of your home dirs.
Remember to remove `ALLOW_FIRST_RUN=1` when it's not needed anymore.

Few notes regarding speed optimisation:

* If you're used to run `pumount` or using GUI way of "safe disk removal", then you can remove "sync" option from `MOUNTOPTIONS` line in `/etc/usbmount/usbmount.conf` file.

* During **first** backup to an **empty** disk, you can consider setting `FS_MOUNTOPTIONS="-fstype=ext4,barrier=0"` in the same file (thanks to [this blog][blog] for researching this). It will make write operation significantly faster, but with danger of losing data in case of power failure (or USB cable disconnect). So it's OK to do in absence of other valuable data on the disk, and makes most sence to do during first, usually longest, backup operation.

[blog]: https://structr.org/blog/neo4j-performance-on-ext4

