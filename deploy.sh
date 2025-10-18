#!/bin/bash
set -e
cd "$(dirname "$0")"
test -f index.html || { echo "❌ index.html fehlt!"; exit 1; }

STAMP=$(date +'%Y-%m-%d_%H-%M-%S')
# Lokales, ignoriertes Backup (sicher)
tar -czf "backup-$STAMP.tar.gz" . --exclude='.git' --exclude='*.tar.gz' || true

git add -A
git commit -m "🚀 Auto-Deploy $STAMP" || echo "ℹ️ Nichts zu committen."
git pull --rebase origin main || true
git push origin main

echo "✅ Online: https://smartlivingberlin.github.io/"
