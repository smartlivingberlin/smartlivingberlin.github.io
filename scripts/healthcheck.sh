#!/usr/bin/env bash
set -e

echo "== 1) HTML prüfen (wenn 'tidy' da ist) =="
if command -v tidy >/dev/null 2>&1; then
  find . -maxdepth 2 -name "*.html" \
  | while read -r f; do
      echo "Prüfe $f"
      tidy -q -errors "$f" >/dev/null || true
    done
else
  echo "(Hinweis) 'tidy' ist nicht installiert. Optional: sudo apt install tidy"
fi

echo; echo "== 2) Wichtige Dateien vorhanden? =="
for f in index.html partials/top5.html partials/weather.html data/news.json data/charts.json; do
  [ -e "$f" ] && echo "[OK] $f" || echo "[FEHLT] $f"
done

echo; echo "== 3) Interne Links checken (ohne Platzhalter & Anker) =="
grep -Rho --include="*.html" 'href="[^"]*"' . \
| cut -d'"' -f2 \
| grep -vE '^\#|^\$\{.*\}|^https?://|^mailto:' \
| sed 's#^\./##' | sort -u \
| while read -r L; do
    P="${L%%\#*}"
    [ -z "$P" ] && continue
    [ -e "$P" ] && echo "[OK]  $L" || echo "[FEHLT] $L"
  done

echo; echo "== 4) Externe Links (Stichprobe) =="
grep -Rho --include="*.html" 'href="https\?://[^"]*"' . | cut -d'"' -f2 | sort -u | head -n 12 \
| while read -r U; do
    printf "Teste %-60s " "$U"
    curl -Is --max-time 5 "$U" | head -n1
  done

echo; echo "== 5) Lokalen Server testen =="
pgrep -f "http.server 8080" >/dev/null || (python3 -m http.server 8080 >/dev/null 2>&1 & sleep 1)
curl -s -I http://localhost:8080/ | head -n1
