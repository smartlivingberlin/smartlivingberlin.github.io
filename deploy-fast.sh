#!/bin/bash
set -e
cd "$(dirname "$0")"
test -f index.html || { echo "❌ index.html fehlt!"; exit 1; }

git add -A
git commit -m "⚡ Quick deploy $(date +'%Y-%m-%d_%H-%M-%S')" || echo "ℹ️ Nichts zu committen."
git pull --rebase origin main || true
git push origin main

echo "✅ Online: https://smartlivingberlin.github.io/"
