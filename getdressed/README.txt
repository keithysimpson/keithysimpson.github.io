DRESSING APP - MORNING ROUTINE TIMER
=====================================

A visual timer and gamified morning routine app designed to aid individuals who struggle with executive function and focus to get dressed independently.

Screen Layout:
- Top: Digital timer with a full-width visual progress bar running edge-to-edge across the screen.
- Left Box: "🌙 Pyjamas" (where pj_top and pj_bottoms live)
- Right Box: "👕 Day Clothes" (where shirt, pants/underwear, trousers, and socks live)
- Bottom: Clear action buttons with labels ("⏸ Pause" / "▶ Resume", "🔄 Restart")
- "All dressed?" Button: A prominent, glowing green button that appears once all clothes are on when automatically_end is false.

How the App Works:
1. Target Timer: Choose a goal time (default: 5 minutes, or 2, 3, 7, 10 minutes, or custom).
2. Starting State: The character always begins wearing pyjamas.
3. Flexible Dressing Flow:
   - Users can dress either half of the body first!
   - Upper body: Take off pyjama top into the Left Box, then put on the shirt. (Pyjama bottoms can stay on while doing this!)
   - Lower body: Take off pyjama bottoms into the Left Box, then put on underwear, trousers, and socks. (Pyjama top can stay on while doing this!)
   - Or take both pyjamas off first, as preferred.
4. Natural Sequence Guidance:
   - Pyjama top must be off before putting on the shirt.
   - Pyjama bottoms must be off before putting on underwear, trousers, or socks.
   - Underwear must be on before putting on trousers.
5. Finishing the Run (automatically_end parameter):
   - By default, automatically_end = false.
   - When false: once all clothes are on the character, the timer continues and a prominent "All dressed?" button appears. Pressing this button stops the timer and completes the run!
   - When true: the run ends immediately as soon as the last item of clothing snaps onto the character.
   - You can toggle this parameter in items.js or index.html ("automatically_end": false / true).
6. Audio Cues:
   - At each minute mark, rings out bell dings matching the minute (1 ding at 1 min, 2 dings at 2 min, 3 dings at 3 min, etc.)
   - Snap pops when clothes are put on, whoosh on removal, and victory fanfare at the end.
7. Report & Celebration: When the run ends, fireworks burst, and the exact time taken is reported with target comparison and personal best tracking!

Controls & Accessibility:
- Drag & Drop: Drag items onto the character or to their boxes.
- Double-Tap / Double-Click: Double-tap any item to put it on or take it off instantly without needing to drag!
- "All dressed?" Button: Click or press Space / Enter when all clothes are on to finish the run.
- Bottom Buttons: "⏸ Pause" / "▶ Resume" and "🔄 Restart".
- Keyboard:
  - Space or Enter: Start timer / Finish run when "All dressed?" is shown / Pause / Resume / Play again
  - Escape or R: Reset to timer setup
- Overtime Support: If time expires, the timer switches gently to overtime without harsh penalty, encouraging the user to finish strong.

Artwork & Customization:
  pip install psd-tools pillow
  python3 extract_psd.py your_file.psd
  (bottom layer = body, layers starting with 'pj_' = pyjamas, other layers = daytime clothes, PSD order = stacking order)

Layout:
  items.js holds each item's resting spot: "home": [x, y] and "homeScale", as well as "automatically_end".
  Edit by hand if you like; re-running the script keeps your edits for layers with the same name. Delete items.js first to reset the layout.
