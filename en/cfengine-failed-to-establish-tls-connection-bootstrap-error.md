title=CFEngine Failed to establish TLS connection bootstrap error
intro=Maybe agent's IP is not among allowed ones?
created=2017-03-22
tags=CFEngine

If bootstrapping of CFEngine agent fails with a cryptic error about TLS connection like this:

	cf-agent -B 138.68.252.222
	notice: Bootstrap mode: implicitly trusting server, use --trust-server=no if server trust is already established
	error: Failed to establish TLS connection: socket closed
	error: No suitable server found
	error: Failed to establish TLS connection: socket closed
	error: No suitable server found
	error: Failed to establish TLS connection: underlying network error (Connection reset by peer)
	error: No suitable server found
	error: Method 'failsafe_cfe_internal_update' failed in some repairs
	R: Bootstrapping from host '<IP>' via built-in policy '/var/cfengine/inputs/failsafe.cf'
	R: This autonomous node assumes the role of voluntary client
	error: Bootstrapping failed, no input file at '/var/cfengine/inputs/promises.cf' after bootstrap

check if you've added agent's IP to the ACL in def.cf

