title=CFEngine Failed to establish TLS connection bootstrap error
uuid=38dcad80-9c68-4040-b266-ecf9f439e4df
PROCESSOR=Markdown.pl
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

check if you've added agent's IP to the ACL in def.cf / def.json.

----

**Update**: For the record, here's my favourite def.json:

	{
		"classes": {
			"client_initiated_reporting_enabled": [ "any" ],
			"mpf_augments_control_enabled": [ "any" ],
			"services_autorun": ["any"]
		},
		"vars": {
			"default_data_select_host_monitoring_include": [ ".*" ],
			"default_data_select_policy_hub_monitoring_include": [ ".*" ],
			"control_server_call_collect_interval": "1",
			"control_executor_splaytime": "1",
			"control_executor_schedule": ["any"],
			"control_hub_hub_schedule": ["any"],
			"control_hub_exclude_hosts": [ "0.0.0.0/0" ],
			"mpf_access_rules_collect_calls_admit_ips": [ "0.0.0.0/0" ],
			"acl": [ "0.0.0.0/0", "::/0" ]
		}
	}

This also enables client-initiated reporting and configures cf-agent to run every minute.

Sources:

* [internal ticket][i]

* [cf-remote][c]

[i]: https://tracker.mender.io/browse/ENT-3157
[c]: https://github.com/cfengine/cf-remote/blob/master/cf_remote/demo.py#L35

