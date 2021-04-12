title=How to use parameters to set working directory in org mode code block
intro=For when you want working dorectory (:dir) be a parameter, just like variable (:var)
tags=org
created=2020-04-11

Org mode code blocks have a very powerful feature of being exeutable.
You can type some code like this:

    #+begin_src sh :results scalar
      echo "hello, my hostname is:"
      hostname
    #+end_src

Point a text cursor there, press Ctrl+C twice, and the following output appears below:

    #+RESULTS:
    : hello, my hostname is:
    : flower2

`:results scalar` is there to make output appear as-is, and not as table.

You can as well pass arguments to code blocks.
Moreover, you can store such argument in one place, and reuse it in several code blocks:

    #+name: hostname
    | shpakovsky.ru |

    #+begin_src sh :var host=hostname :results scalar
      echo "hostname of $host is:"
      ssh root@$host hostname
    #+end_src

    #+RESULTS:
    : hostname of shpakovsky.ru is:
    : shpakovsky.ru

You can read more about it in [orgmode manual][env].

Moreover, you can specify working directory, and it even supports TRAMP syntax, so you can run this code on a remote machine.
Of course, you can prepend your commands with `ssh $host`, but if you have more than a few commands, or would like to use some other programming language -
using TRAMP is much better.

However, can you can't easily pass directory name as parameter.

But you can write some simple _elisp_ helper, which will get property and format it as desired.
Apparently, this is [documented][doc] feature.
So far I succeeded only at getting properties inside `:PROPERTIES:` header, but that's better than nothing!
Look:

    * Define your inputs here
      :PROPERTIES:
      :host:     shpakovsky.ru
      :user:     alexey
      :header-args: :results scalar
      :END:

    #+begin_src emacs-lisp :results silent
      (defun host ()
        (org-entry-get nil "host" t))
      (defun user ()
        (org-entry-get nil "user" t))
      (defun ssh_dir ()
        (format "/ssh:%s@%s:" (user) (host)))
    #+end_src

    #+begin_src sh :dir (ssh_dir)
      echo "running as user $(whoami) on host $(hostname)"
      echo "my public IP address is:"
      curl ifconfig.co
      echo "and it resolves back to:"
      host `curl -s ifconfig.co`
    #+end_src

    #+RESULTS:
    : running as user alexey on host shpakovsky.ru
    : my public IP address is:
    : 109.120.165.193
    : and it resolves back to:
    : 193.165.120.109.in-addr.arpa domain name pointer shpakovsky.ru.

Note, however, that since this way you'll be using _headers_ instead of _tables_ for "host" and "user" values,
you will have to wrap them in braces, like this:

    #+begin_src sh :var host=(host)
      echo "above code was executed on $host"
    #+end_src

    #+RESULTS:
    : above code was executed on shpakovsky.ru

**Update from 2020-04-20:** as [this StackExchange answer][a] suggests, you can make these values available from other sections (not only the one where they are defined, with all its subsections) by using "executable code blocks" and wrapping `org-entry-get` into `org-with-point-at org-babel-current-src-block-location`, like this:

	* Section One
	  :PROPERTIES:
	  :hellomessage: hello
	  :END:

	  #+NAME: get_property
	  #+BEGIN_SRC emacs-lisp :var prop_name="" :results silent
	  (org-with-point-at org-babel-current-src-block-location
	    (org-entry-get nil prop_name t))
	  #+END_SRC

	* Section Two

	  #+HEADER: :var prop_message=get_property("hellomessage")
	  #+BEGIN_SRC emacs-lisp
	    (message prop_message)
	  #+END_SRC

	  #+RESULTS:
	  : hello

Note, however, that you will have to confirm code block execution twice.

**Update from 2020-04-14:** you can also get results or previous blocks like this (also posted on [StackExchange][a1]):

	#+name: block-1
	#+BEGIN_SRC sh
	  echo '/bin'
	#+END_SRC

	#+RESULTS: block-1
	: /bin

	#+begin_src emacs-lisp :results silent
	  (defun result1 ()
	    (save-excursion
	      (org-babel-goto-named-result "block-1")
	      (setq value (org-babel-read-result))
	      )
	    (print value)
	    )
	#+end_src

	#+BEGIN_SRC sh :dir (result1) :results scalar
	  pwd
	#+END_SRC

	#+RESULTS:
	: /bin


[env]: https://orgmode.org/manual/Environment-of-a-Code-Block.html

[dir]: https://orgmode.org/manual/Environment-of-a-Code-Block.html#Choosing-a-working-directory

[doc]: https://orgmode.org/manual/Environment-of-a-Code-Block.html#:~:text=Emacs%20lisp%20code%20can%20also%20set%20the%20values%20for%20variables

[a]: https://emacs.stackexchange.com/a/41951/28525

[a1]: https://emacs.stackexchange.com/a/57796/28525
