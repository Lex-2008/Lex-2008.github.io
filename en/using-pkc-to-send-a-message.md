title=using public key cryptography to send a message
intro=How to send a message to your friend over insecure lines and be sure that only they can read it
tags=security
style=
styles=
created=2024-10-29
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Very easy! If you both have Linux or Mac environment and can use command line:

1. The person **receiving** the message generates public and private keys, like this:

		openssl genpkey -out key.priv -outpubkey key.pub -algorithm RSA

   Then they send the _public_ key (`key.pub`) to the person **sending** the message, and keep the _private_ key (`key.priv`) to themselves for step 3.

2. The person **sending** the message encrypts it like this:

		openssl pkeyutl -encrypt -inkey key.pub -pubin -in file.txt -out file.rsa

   Where `file.txt` contains the message you want to encrypt.
   If you omit the `-in file.txt` part, you can simply type the message in console.
   This command will create `file.rsa` file with encrypted message.
   Send it to the person **receiving** the message.

3. The person **receiving** the message can decrypt it using the private key generated on step 1, like this:

		openssl pkeyutl -decrypt -inkey key.priv -in file.rsa # -out file.txt

   Note that if you add `-out file.txt` part, then the secret message will be saved in `file.txt`, otherwise you'll see it on screen.

[Source][x] which uses older openssl commands

[x]: https://gist.github.com/thinkerbot/706137

* * *

Alternatively, if some of you don't have Linux or Mac, or are not very comfortable with command line, you could simply use a web browser: <https://lex-2008.github.io/pkc/>

* * *

Also note that it's best to avoid encrypting big files using asymmetric cyphers.
If you need to transfer some big files - it's better to put them in a password-protected archive, and use asymmetric encryption to share only the password.
