title=How to selectively clean history in Google Chrome
PROCESSOR=Markdown.pl
intro=To remove, say, histroy of browing Facebook from work computer.
tags=chromium
created=2017-09-25

As a follow-up for [similar post about Opera browser][o], here are instructions on cleaning your history in Chrome:

1. Open history page (Ctrl+H on Linux and Windows)

2. Type facebook.com in search field

3. Note the absence of "select all" button, which we will emulate in the next step

4. Press Ctrl+Shift+I - DevTool will appear

5. Go to "Console" tabe and paste this:

		$$('* /deep/ #checkbox[aria-checked="false"]').map(a=>a.click()).length

6. Hit Enter - it will print some number back to you and you will see some checkboxes to be checked

7. Scroll lower - you will see that not all checkboxes were checked

8. In Console, press Arrow Up button and Enter again

9. It will again print a number and select some checkboxes for you

10. Keep repeating the command until it prints 0

11. Verify that all checkboxes are checked (if not - issue the command when unchecked checkboxes are still on the screen)

12. Click Delete and see al your history gone!

[o]: how-to-selectively-clean-history-in-opera-browser.html "How to selectively clean history in Opera browser"
