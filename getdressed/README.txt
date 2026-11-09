DRESSING APP
============

# TBC: add goal of app here




Update the artwork
  pip install psd-tools pillow
  python3 extract_psd.py your_file.psd
  (bottom layer = body, other layers = clothes, PSD order = stacking order)

Layout
  items.js holds each item's resting spot: "home": [x, y] and "homeScale".
  Edit by hand if you like; re-running the script keeps your edits for layers with
  the same name. Delete items.js first to reset the layout.
