title=Defrag SSD in VM on HDD
created=2021-11-27
intro=Even if OS sees a storage device as SSD and refuses to defrag it - you might know better
tags=windows

Why
---

When host OS has _at least one_ SSD disk,
VMware [reports][vmware-ssd] all disks as SSD to guest OS,
even if its disk image file is actually located on HDD.

[vmware-ssd]: https://docs.vmware.com/en/VMware-Workstation-Player-for-Linux/16.0/com.vmware.player.linux.using.doc/GUID-3FBBB031-D8BA-4D02-99C2-282F806F47E8.html

How
---

Solution is to use a program released **before** SSD disks became widespread -
for example, JkDefrad: [official website][jkdefrag.site], [download link][jkdefrag.exe].

[jkdefrag.site]: https://www.kessels.com/JkDefrag/
[jkdefrag.exe]: ../unlisted/JkDefrag.exe

----

Русская версия этой заметки: [Дефрагментация SSD](../ru/%D0%B4%D0%B5%D1%84%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F-ssd.html)
