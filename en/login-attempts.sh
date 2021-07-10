#!/bin/sh
#
# Script to list all login attempts
#
# Usage: pass contents of auth.log as stdin,
# and catch HTML output at stdout, like this:
#
# ./login-attempts.sh </containers/nginx.cont/data/logs/auth.log.gz >login-attempts.htm

echo '<tr><th>Datetime (UTC)</th><th>proto</th><th>[username]</th><th>[password]</th><th>source IP</th></tr>'
zcat | tail -n10000 | tac | cut -d' ' -f1,3,6,7,9 | sed 's_^_<tr><td>_;s_ _</td><td>_g;s_$_</td></tr>_;s_:_ _'
