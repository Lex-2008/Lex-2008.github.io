title=Forward SMB via SSH tunnel
intro=When SSH is your poor man's VPN
tags=bash windows linux
created=2017-04-30

Imagine that you need to access a Windows share from your Windows machine and you have a Linux box to help you.
Then you just need to forward port 445 from remote. But there are few caveats.

* First, you need to disable built-in SMB server on the Windows machine you're connecting from:

		C:\>sc config "LanmanServer" start= disabled

	and restart the computer. Because otherwise you won't be able to bind to port 445 on the same machine,
	and Windows doesn't allow you to use any other port to connect to remote file shares.

* You need a working SSH connection from Windows machine to the Linux box which can connect to your Windows share.
	How to set this up is outside of scope of this article, but reverse-port-forwarding via a cheap VPS helped me.

* Then, you set up a local port forward like shown on this picture.

	![Picture showing how to add port forward to PuTTY](forward-smb-via-ssh-tunnel.png)

* Then, open this connection and open `\\192.168.0.1\` in file manager (Windows Explorer).

* As an extra bonus, you might want to strengthen your setup:

	* Use a dedicated user for port forward, who is not allowed to login (has `/bin/false` as shell in `/etc/passwd`)

	* Forbid this user to run any commands (use `ForceCommand` in `/etc/ssh/sshd_config` file in `Match User {username}` section)

	* Use a password on the keyfile
