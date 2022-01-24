title=How to limit SystemD units (services) to use only one CPU core
intro=TL;DR: make a cgroup and assign processes into them, in the systemd .service file
tags=CFEngine Linux links
styles=archive
created=2018-07-27

My colleague [Ole Herman Schumacher Elgesem][ole] wrote a nice [article][][(Cached version)](http://archive.li/7Ztya) how to do it for CFEngine. Quite useful bit of knowledge! I wonder if you can limit your CPU- and memory-hungry browser in the same way :-)

[ole]: https://github.com/olehermanse
[article]: https://oleherman.com/unix/systemd_dedicated_cpu/
