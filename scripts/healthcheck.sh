#!/usr/bin/env bash
set -e
echo "== HTML-Dateien =="
find . -maxdepth 2 -name "*.html" | wc -l
echo
echo "== Wichtiges Vorhanden? =="
for f in index.html partials/top5.html data/news.json data/charts.json; do
  [ -e "$f" ] && echo "[OK] $f" || echo "[FEHLT] $f"
done
echo
echo "== Interne Links (stichprobe) =="
grep -Rho --include="*.html" 'href="[^"]*"' . | cut -d'"' -f2 \
| grep -vE '^\#|^\$\{.*\}|^https?://|^mailto:' | head -n 15
