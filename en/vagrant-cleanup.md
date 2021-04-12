title=Vagrant cleanup
intro=How to cleanup <tt>vagrant global-status</tt>? TL;DR: <tt>vagrant global-status --prune</tt>
tags=Vagrant
created=2018-11-27

Vagrant is a very useful tool to quickly spin up VM environments, given Vagrantfile.
It simplifies creating VMs to simple `vagrant up` command, that does everything for you.
For example, we in CFEngine [provide][cfe] such environments for testing - they create VMs, install CFengine, bootstrap it to each other - and then you can just `vagrant ssh hub` to get into VM to explore, or open Mission Portal and enjoy.

So, to use Vagrant, you must be in directory with a Vagrantfile.
And `vagrant global-status` is a command that shows you all VMs created by Vagrant, no matter in what directory they were created.

But sometimes, if you played too much, you could delete the directory with Vagrantfile - after that you can delete VM from your usual VM manager interface (usually, VirtualBox) - and it seems to be almost cleaned up, except that `vagrant global-status` still prints it.

How can you clean it? Easy:

	vagrant global-status --prune

And all non-existing VMs will be gone!

Source: <https://github.com/hashicorp/vagrant/issues/5843>

[cfe]: https://docs.cfengine.com/docs/3.12/guide-installation-and-configuration-general-installation-installation-enterprise-vagrant.html#start-the-cfengine-enterprise-3-12-vagrant-environment
