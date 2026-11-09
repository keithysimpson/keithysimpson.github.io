DRESSING APP - MORNING ROUTINE TIMER
=====================================

A visual timer and gamified morning routine app designed to aid individuals who struggle with executive function and focus to get dressed independently.

Screen Layout:
- Top: Digital timer with a full-width visual progress bar running edge-to-edge across the screen.
- Left Box: "🌙 Pyjamas" (where pj_top and pj_bottoms live)
- Right Box: "👕 Day Clothes" (where shirt, pants/underwear, trousers, and socks live)
- Bottom: Clear action buttons with labels ("⏸ Pause" / "▶ Resume", "🔄 Restart")

How the App Works:
1. Target Timer: Choose a goal time (default: 5 minutes, or 2, 3, 7, 10 minutes, or custom).
2. Starting State: The character always begins wearing pyjamas.
3. Step 1 (Undress): Drag or double-tap the pyjamas off into the Left Box.
4. Step 2 (Dress): Drag or double-tap daytime clothes onto the character from the Right Box (underwear before trousers).
5. Audio Cues:
   - At each minute mark, rings out bell dings matching the minute (1 ding at 1 min, 2 dings at 2 min, 3 dings at 3 min, etc.)
   - Snap pops when clothes are put on, whoosh on removal, and victory fanfare at the end.
6. Timer Stop & Report: As soon as daytime clothes are on and pyjamas are in the Left Box, the timer stops automatically, fireworks burst, and the exact time taken is reported with target comparison and personal best tracking!

Controls & Accessibility:
- Drag & Drop: Drag items onto the character or to their boxes.
- Double-Tap / Double-Click: Double-tap any item to put it on or take it off instantly without needing to drag!
- Bottom Buttons: "⏸ Pause" / "▶ Resume" and "🔄 Restart".
- Keyboard:
  - Space: Start timer / Pause / Resume / Play again
  - Escape or R: Reset to timer setup
- Overtime Support: If time expires, the timer switches gently to overtime without harsh penalty, encouraging the user to finish strong.

Artwork & Customization:
  pip install psd-tools pillow
  python3 extract_psd.py your_file.psd
  (bottom layer = body, layers starting with 'pj_' = pyjamas, other layers = daytime clothes, PSD order = stacking order)

Layout:
  items.js holds each item's resting spot: "home": [x, y] and "homeScale".
  Edit by hand if you like; re-running the script keeps your edits for layers with the same name. Delete items.js first to reset the layout.
