#!/bin/sh
#
# Script to list all spammers
#
# Usage: pass contents of postfix log as stdin,
# and catch HTML output at stdout, like this:
#
# ./spam-emails.sh </containers/postfix.cont/data/logs/mail.log >spam-emails-3.htm

grep 'NOQUEUE.*blocked using rbl.rbldns.ru' | sed -r '/from=<>/d;s/^(...) (..) .* RCPT from ([^:]*): .* from=<([^>]*)>( .* helo=<([^>]*)>)*.*/\1@\2@\4<\/td><td>from \3 helo \6/;s/>from unknown\[/>from [/;s/] helo $//' | LC_ALL=C sort -u -t '@' -k 1,1Mr -k 2,2r -k 4 -k 3 | sed -n 's/@/ /; s/@/%/; H; g;/^\(... ..\)\n\1/!{s/.*\n\(.*\)%.*/<tr><td>\1<\/td><\/tr>/;p}; g;s/.*%\(.*\)/<tr><td>\1<\/td><\/tr>/;p; g;s/.*\n\(.*\)%.*/\1/;h'
