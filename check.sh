#!/bin/bash
# Sicherstellen, dass wir im Projektordner sind
cd ~/smartliving.berlin || { echo "❌ Projektordner fehlt!"; exit 1; }

# Prüfen, ob index.html vorhanden ist
if [ ! -f index.html ]; then
  echo "❌ index.html fehlt im Projektordner!"
  exit 1
fi

echo "✅ Projektordner: $(pwd)"
echo "------------------------------------"

# Git-Status
git status --short || echo "⚠️ Kein Git-Repo gefunden."
