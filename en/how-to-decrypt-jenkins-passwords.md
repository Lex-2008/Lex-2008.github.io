title=How to decrypt Jenkins passwords
intro=with the help of script console
tags=jenkins cfengine
style=
styles=
created=2022-10-09

To decrypt a _single_ (very long) `{XXX=}` string, paste this:

	println(hudson.util.Secret.decrypt("{XXX=}"))

To see **all** stored password, SSH keys, and what else credentials you have, paste this:

	com.cloudbees.plugins.credentials.SystemCredentialsProvider.getInstance().getCredentials().forEach{
		it.properties.each { prop, val ->
			if (prop == "secretBytes") {
				println(prop + "=>\n" + new String(com.cloudbees.plugins.credentials.SecretBytes.fromString("${val}").getPlainData()) + "\n")
			} else {
				println(prop + ' = "' + val + '"')
			}
		}
		println("-----------------------")
	}

Source: [devops][s]

[s]: https://devops.stackexchange.com/questions/2191/how-to-decrypt-jenkins-passwords-from-credentials-xml
