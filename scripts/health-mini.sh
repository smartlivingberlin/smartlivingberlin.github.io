#!/usr/bin/env bash
echo "== Dateien vorhanden? ==";
for f in index.html data/news.json partials/top5.html partials/weather.html; do
  [ -e "$f" ] && echo "[OK] $f" || echo "[FEHLT] $f";
done
echo; echo "== Interne Links prüfen ==";
grep -Rho --include="*.html" 'href="[^"]+"' . \
| cut -d'"' -f2 | grep -vE '^https?://|^#|^mailto:' | sed 's/#.*$//' | sort -u \
| while read -r L; do [ -z "$L" ] && continue; [ -e "$L" ] && echo "[OK]  $L" || echo "[FEHLT] $L"; done
