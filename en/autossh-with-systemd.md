title=AutoSSH with SystemD
uuid=71203306-cf84-4116-8232-4382019cb586
intro=a simple unit file to keep a permanent SSH connection
tags=Linux
style=
styles=
created=2022-12-28
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Save this file as `/etc/systemd/system/autossh.service`:
````
[Unit]
Description=Keep SSH bridge

[Service]
Type=simple
ExecStart=ssh -R *:2223:*:22 username@remote-server
Restart=always
RestartSec=3
````

Adjust ssh command to your liking (keepalives, timeouts, etc)

After that, run `systemctl daemon-reload` and `systemctl enable --now autossh`, and enjoy!

----

Comment from [Vladimir Kondratiev](https://github.com/Vladimir-Kondratiev):

> There are not enough keys in your connect command. For example, if you reinstall the server which you are connecting to (or change its real ip), then the MITM question will appear and will wait forever for the user's response. Therefore, this check must be disabled with two keys directly in the ssh command.

> It would also be nice to set in the ssh config to automatically disconnect from the server when the connection is broken - otherwise it will not be possible to ssh to it again for a long time. (I did this in the ssh config: every 30 seconds ssh sends a packet, if 3 packets did not pass (so in 90 seconds) - break the ssh connection, which will lead to a restart according to your SystemD.

> Since you have reverse ssh, instead of the ip of the user who will log in, it will always be 127.0.0.1 in the logs, in order to fix this, you need to patch ssh, otherwise the fail2ban will go blind. Or use fail2ban on the server which you connecting to with the -R key (which is not cool).

> I used iptables + ssh logs for a fail2ban (iptables shows all ip connections, and ssh log shows successful connections: if ip is in iptables and there is no successful login in ssh logs - then ban it). The fact is that ssh logs a) not all connections are logged in principle (the problem of the logging system itself - as I understand it, there is a limit at what speed to write to a file or there is a parallel recording, I didn’t investigate much) b) fail2ban does not see all the records of connection attempts - since each version of the ssh server adds new words to the logs, but a successful login always looks the same.

My reply:

> That is true! But to be fair, I'm not using fail2ban.
> I haven't heard about anyone bruteforcing an SSH key, yet.
> So I believe that it's enough just to disable _password_ SSH login to consider your SSH server secure.
> Other methods (like changing SSH port, or blocking IPs/subnets) are only for keeping logs clean from this noise.

> If anything, my personal preference is to block **all** IP addresses, _except_ networks of those few ISPs I'm using (home, work, mobile, etc) - using `/etc/hosts.allow` and `/etc/hosts.deny` files.
> And hope that they all won't change at the same time! 🙈

And his reply:

> Erm I'm using iptables + ssh logs plus my analyzer INSTEAD of fail2ban. So I need to teach iptables to log only the ssh port (so log will contain lines from which mac to which mac address that came and the corresponding ip), the ssh log is written by ssh itself. And I parse them with my analyzer.

> Plus, at the iptables level, it is limited to establishing new connections from 1 ip per minute to the ssh port. Iptables is faster than ssh (and doesn't know which version of ssh you have). This is without ssh settings yet.

> All the same, it is necessary to change the port and limits too - because after a year there will be 10s of gigabytes of these logs.
