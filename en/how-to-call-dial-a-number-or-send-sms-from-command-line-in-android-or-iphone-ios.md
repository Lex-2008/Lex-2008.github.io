title=How to call (dial a number) or send SMS from command line in Android or iPhone (iOS)
PROCESSOR=Markdown.pl
intro=Note that to get command line on iPhone, you need to jailbreak it first.
tags=bash android
created=2014-11-29


iPhone
======

**To call**: install sbutils from Cydia and type this on command line:

	sbopenurl tel:+79123456789

**To SMS**: install biteSMS from Cydia and type this:

	/Applications/biteSMS.app/biteSMS -send -carrier +79123456789 'hello'

Note that I tried some other application,
but it don't work with Cyrillic (and probably other non-ASCII) letters

* * *

Android
=======

**To call**:

	am start -a android.intent.action.CALL -d tel:+79123456789

**To SMS**: install shellMS from F-Droid and follow its instructions, like this:

	am startservice -n com.android.shellms/.sendSMS -e contact +79123456789 -e msg 'hello'

Note that I tried using some native intent,
but it didn't even fill in the message.

**To turn screen on or off**, emulate pressing "power" button:

	input keyevent 26

**To check if screen is on or off** (note that you need Unix tools for this):

	dumpsys power | grep blanked | sed 's/.*=//'
