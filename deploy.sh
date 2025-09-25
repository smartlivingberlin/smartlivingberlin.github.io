#!/bin/bash
set -e

# 1) Projektordner öffnen
cd ~/smartliving.berlin || { echo "❌ Projektordner fehlt!"; exit 1; }

# 2) Prüfen
if [ ! -f index.html ]; then
  echo "❌ index.html fehlt im Projektordner!"
  exit 1
fi

# 3) Backup (klein, nur lokale Sicherheit, nicht ins Repo)
STAMP=$(date +"%Y-%m-%d_%H-%M-%S")
tar -czf backup-$STAMP.tar.gz . --exclude=".git" --exclude="*.tar.gz" || true

# 4) Git commit & push
git add -A
git commit -m "🚀 Auto-Deploy $STAMP" || echo "ℹ️ Nichts zu committen."
git pull --rebase origin main || true
git push origin main

# 5) Online-Link
echo "✅ Fertig! Online prüfen: https://smartlivingberlin.github.io/"
