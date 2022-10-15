title=Дефрагментация SSD
PROCESSOR=Markdown.pl
created=2021-11-27
intro=Как дефрагментировать диск, если система считает его SSD
tags=программы

Проблема
--------

Я хочу дефрагментировать диск,
но Windows говорит, что это SSD,
и поэтому дефрагментировать его не нужно и даже вредно.

Но я-то знаю, что этот Windows установлен в [виртуальную машину][vm],
и что когда VMware говорит ему, что это SSD диск - то он ошибается
(дело в том, что если на "хостовой" системе есть _хотя бы один_ SSD-диск,
то VMware [сообщает][vmware-ssd] гостевой системе, что _все_ её диски являются SSD,
независимо от того, на каком диске на самом деле расположен файл образа её диска).

[vm]: https://ru.wikipedia.org/wiki/%D0%92%D0%B8%D1%80%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D0%B0
[vmware-ssd]: https://docs.vmware.com/en/VMware-Workstation-Player-for-Linux/16.0/com.vmware.player.linux.using.doc/GUID-3FBBB031-D8BA-4D02-99C2-282F806F47E8.html

Решение
-------

Использовать программу дефрагментации, написанную **до** повсеместного распространения SSD-дисков.
Например, JkDefrag: [официальный сайт][jkdefrag.site], [ссылка на скачивание][jkdefrag.exe].

[jkdefrag.site]: https://www.kessels.com/JkDefrag/
[jkdefrag.exe]: ../unlisted/JkDefrag.exe

----

Enlish version of this post: [Defrag SSD in VM on HDD](../en/defrag-ssd-in-vm-on-hdd.html)
