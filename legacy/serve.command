#!/bin/bash
# Double-click this file to open the roadmap in your browser.
# It serves this folder locally so index.html can read roadmap.txt.
cd "$(dirname "$0")" || exit 1

PORT=8123
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done

echo "Serving $(pwd) at http://localhost:$PORT"
echo "Keep this window open while you use the page. Press Ctrl+C to stop."
( sleep 1; open "http://localhost:$PORT/index.html" ) &
python3 -m http.server "$PORT"
