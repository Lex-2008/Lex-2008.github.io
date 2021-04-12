title=How to install extensions to CFEngine's PostgreSQL
intro=TL;DR: copy libs to <code>/var/cfengine/lib/postgresql/</code> and extensions - to <code style='word-break:break-all'>/var/cfengine/share/postgresql/extension</code>.
tags=CFEngine
created=2018-02-07


Environment
-----------

This is the environment I was working with:

* OS: CentOS 6.9

* CFEngine: 3.7.3 Enterprise

* PostgreSQL version: 9.3 (shipped together with CFEngine)

* Desired plugin: [pg-dns-resolve][] so you could issue `SELECT gethostbyname('www.google.com')`.

[pg-dns-resolve]: http://pgfoundry.org/projects/pgdnsres/

Investigation
-------------

Download the script above and inside it you will find installation instructions:

	* Make sure, you have ip4r installed. Get it from: http://pgfoundry.org/projects/ip4r/
	* Make sure, you have PL/Pythonu installed and are allowed to add new functions
	* PL/Pythonu must be built against Python >= 2.4
	* psql [YOUR OPTIONS] < plpython_dns-functions.sql

You actually don't need to build ip4r and PL/Python from sources,
since PostgreSQL provides packages for them (but not for pg-dns-resolve).
You can download them from here: <https://ftp.postgresql.org/pub/repos/yum/9.3/redhat/rhel-6.9-x86_64>
(Note that URL mentions PostgreSQL **9.3** and RedHat **6.9** versions, what corresponds to our environment)


ip4r installation
-----------------

Navigate to above URL and search (Ctrl+F) for "ip4r". You will find two packages: `ip4r93-2.1-1.rhel6.x86_64.rpm` and `ip4r93-2.2-1.rhel6.x86_64.rpm` - note that they differ only in version, so let's install latest one :-)

SSH into your your CFEngine Hub machine and issue the following commands:

1. Download the ip4r package

		wget https://ftp.postgresql.org/pub/repos/yum/9.3/redhat/rhel-6.9-x86_64/ip4r93-2.2-1.rhel6.x86_64.rpm

2. Install it ignoring dependencies. RPM will complain that ip4r requires PostgreSQL to be installed and is broken without it, but that's fine - we don't need a _system_ PostgreSQL, we have one shipped with CFEngine, instead. Actually, we need only some files from this RPM package:

		rpm -U ip4r93-2.2-1.rhel6.x86_64.rpm --nodeps

3. List extracted files:

		rpm -q --filesbypkg ip4r93

	We see that this package installed `ip4r.so` into library path `/usr/pgsql-9.3/lib/` and few extensions to `/usr/pgsql-9.3/share/extension/`

4. Copy them to CFEngine-PostgreSQL dirs:

		cp /usr/pgsql-9.3/lib/ip4r.so /var/cfengine/lib/postgresql/
		cp /usr/pgsql-9.3/share/extension/ip4r* /var/cfengine/share/postgresql/extension

5. Let CFEngine's PostgreSQL know about new extension (you need to `cd` to a `cfpostgres`-user-readable dir before running `psql` command):

		cd /tmp
		su cfpostgres -c "/var/cfengine/bin/psql cfmp -c 'CREATE EXTENSION ip4r;'"

6. This part is done!


PL/Python installation
-----------------------

Same as for ip4r: find latest package in the [package list][] (at the moment of writing this guide it was `postgresql93-plpython-9.3.20-5PGDG.rhel6.x86_64.rpm`) and run the following commands on your hub:

[package list]: https://ftp.postgresql.org/pub/repos/yum/9.3/redhat/rhel-6.9-x86_64

1. Download:

		wget https://ftp.postgresql.org/pub/repos/yum/9.3/redhat/rhel-6.9-x86_64/postgresql93-plpython-9.3.20-5PGDG.rhel6.x86_64.rpm

2. Unpack:

		rpm -U postgresql93-plpython-9.3.20-5PGDG.rhel6.x86_64.rpm --nodeps

3. List:

		rpm -q --filesbypkg postgresql93-plpython

4. Copy:

		cp /usr/pgsql-9.3/lib/plpython2.so /var/cfengine/lib/postgresql/
		cp /usr/pgsql-9.3/share/extension/plpython* /var/cfengine/share/postgresql/extension

5. Install (note that here command is slightly different, since we're installing _language_, not _extension_):

		cd /tmp
		su cfpostgres -c "/var/cfengine/bin/psql cfmp -c 'CREATE LANGUAGE plpythonu;'"

6. Done!


pg-dns-resolve installation
---------------------------

Here everything is easier - just download and follow the official 1-command "guide":

1. Download

		wget http://pgfoundry.org/frs/download.php/2758/plpython_dns-functions.sql

2. Install

		cd /tmp
		su cfpostgres -c "/var/cfengine/bin/psql cfmp -f plpython_dns-functions.sql"

3. Enjoy!

		su cfpostgres -c "/var/cfengine/bin/psql cfmp -c \"select hostbyname('www.google.ru')\""
	
	Expected output:

   		   hostbyname   
		----------------
 		 64.233.165.94
		(1 row)
