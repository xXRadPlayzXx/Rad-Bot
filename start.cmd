set ghost = wscript.CreateObject("WScript.Shell")

ghost.run "notepad"
wscript.sleep 3000
ghost.sendkeys "Hello."
wscript.sleep 1000
ghost.sendkeys "I am a magical ghost "
wscript.sleep 1000
ghost.sendkeys "who possesed your keyboard."