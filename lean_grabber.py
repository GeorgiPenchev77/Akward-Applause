import subprocess
import time
import json
import os
from pynput import mouse

#-----------------------CONFIG-----------------------
LOG_FILE = "highlights.json"

#-----------------------Captures current window and clipboard-----------------------
# This function runs `xdotool` to find the active window id and name, and `xclip` to read the X clipboard.
# It returns a tuple `(window_name, clipboard_text)`. 
#
# Dependencies: `xdotool`, `xclip` (Linux/X11). Uses `subprocess`.

def get_system_data():
    """Uses native Linux tools to get clipboard and window info."""
    try:
        # Get active window name
        win_id = subprocess.check_output(["xdotool", "getactivewindow"]).decode().strip()
        win_name = subprocess.check_output(["xdotool", "getwindowname", win_id]).decode().strip()
        
        # Get current clipboard content
        content = subprocess.check_output(["xclip", "-selection", "clipboard", "-o"]).decode().strip()
        
        return win_name, content
    except Exception:
        return "Unknown", ""

#-----------------------------------------saves highlight into JSON-------------------------
def save_highlight(text, source):
    """Saves to JSON. Simple append logic."""
    entry = {"source": source, "content": text}
    data = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r') as f:
            try: data = json.load(f)
            except: data = []
    
    data.append(entry)
    with open(LOG_FILE, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Captured: {text[:40]}...")

#-----------------------------------mouse listener callback-------------------------

def on_click(x, y, button, pressed):
    # Trigger ONLY on left-click release
    if not pressed and button == mouse.Button.left:
        # triggers the simulation of ctrl+c and clipboard grab
        subprocess.run(["xdotool", "key", "ctrl+c"])
        
        # small delay to allow for update clipboard
        time.sleep(0.15)
        
        # grab and save data in json
        window, text = get_system_data()
        
        if len(text) > 2:
            save_highlight(text, window)

print(f"Lean Listener Started. Saving to {LOG_FILE}")
with mouse.Listener(on_click=on_click) as listener:
    listener.join()