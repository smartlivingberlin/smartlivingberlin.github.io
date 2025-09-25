#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "📁 Projektordner: $(pwd)"
if [ -f index.html ]; then
  echo "✅ index.html vorhanden"
else
  echo "❌ index.html fehlt – bitte erstellen!"
  exit 1
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "🌿 Branch: $(git rev-parse --abbrev-ref HEAD)"
  echo "🔗 Remote:"; git remote -v | sed 's/^/   /'
  echo "📌 Status (geändert):"; git status -s || true
else
  echo "⚠️ Kein Git-Repository erkannt."
fi
