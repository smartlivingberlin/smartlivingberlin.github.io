#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="reports/health_${STAMP}.txt"
PORT=8080

say(){ printf "%b\n" "$*" | tee -a "$OUT"; }

echo "== SmartLivingBerlin – Healthcheck ($STAMP) ==" > "$OUT"

# 1) Server starten (falls nicht läuft)
if pgrep -f "http.server $PORT" >/dev/null; then
  say "✔ Lokaler Server läuft bereits auf :$PORT"
else
  python3 -m http.server $PORT >/dev/null 2>&1 & sleep 1
  say "✔ Lokalen Server auf :$PORT gestartet"
fi

# 2) Grundlegende Dateien
say "\n== 1) Wichtige Dateien vorhanden? =="
for f in index.html data/news.json data/charts.json partials/top5.html  assets/js/site-search.js; do
  if [ -e "$f" ]; then say "  [OK] $f"; else say "  [FEHLT] $f"; fi
done

# 3) HTML-Validierung (wenn tidy vorhanden)
if command -v tidy >/dev/null 2>&1; then
  say "\n== 2) HTML-Validierung (tidy, still) =="
  ERR=0
  while IFS= read -r -d '' f; do
    if ! tidy -q -errors "$f" >/dev/null 2>>"$OUT"; then
      say "  [HINWEIS] Fehler in $f (siehe Meldungen oben)"; ERR=1
    else
      say "  [OK] $f"
    fi
  done < <(find . -name "*.html" -print0)
  [ "$ERR" -eq 0 ] && say "  ✔ Keine tidy-Fehler erkannt."
else
  say "\n== 2) HTML-Validierung =="
  say "  (übersprungen – tidy nicht installiert)"
fi

# 4) JSON-Syntax prüfen
say "\n== 3) JSON-Syntax prüfen =="
for j in $(find data -name "*.json" 2>/dev/null); do
  if python3 -m json.tool "$j" >/dev/null 2>&1; then
    say "  [OK] $j"
  else
    say "  [FEHLER] Ungültiges JSON: $j"
  fi
done

# 5) Interne Links prüfen (Dateien/Abschnitte)
say "\n== 4) Interne Links prüfen =="
LINKS=$(grep -Rho --include="*.html" 'href="[^"]+"' . | cut -d'"' -f2 | sort -u)
MISS=0
while read -r L; do
  [ -z "$L" ] && continue
  case "$L" in
    \#*|mailto:*|http:*|https:* ) continue ;;
  esac
  P="${L%%\#*}"
  if [ -e "$P" ]; then
    say "  [OK] $L"
  else
    say "  [FEHLT] $L"; MISS=$((MISS+1))
  fi
done <<< "$LINKS"
[ "$MISS" -eq 0 ] && say "  ✔ Alle internen Links zeigen auf vorhandene Dateien."

# 6) Externe Links – Stichprobe HEAD
say "\n== 5) Externe Links (HEAD-Stichprobe) =="
EXT=$(grep -Rho --include="*.html" 'href="https\?://[^"]*"' . | cut -d'"' -f2 | sort -u | head -n 12)
while read -r U; do
  [ -z "$U" ] && continue
  CODE=$(curl -Is --max-time 6 "$U" | head -n1 | tr -d '\r')
  say "  [$CODE] $U"
done <<< "$EXT"

# 7) Bilder: alt-Attribute & Lazy-Loading
say "\n== 6) Bilder: alt & Lazy-Loading =="
IMGS=$(grep -Rho --include="*.html" '<img[^>]*>' . | sed 's/  */ /g')
TOTAL=$(printf "%s\n" "$IMGS" | wc -l | tr -d ' ')
NOALT=$(printf "%s\n" "$IMGS" | grep -vc ' alt=' || true)
NOLAZY=$(printf "%s\n" "$IMGS" | grep -vc ' loading=' || true)
say "  Gesamt <img>: $TOTAL"
say "    ohne alt:   $NOALT"
say "    ohne loading=lazy: $NOLAZY"
[ "$NOALT" -eq 0 ] && say "  ✔ Alle Bilder haben alt."
[ "$NOLAZY" -eq 0 ] && say "  ✔ Alle Bilder lazy."

# 8) HTTP-Status Startseite
say "\n== 7) HTTP-Status =="
say "  $(curl -s -I http://localhost:$PORT/ | head -n1 | tr -d '\r')"

# 9) Size/Assets grob
say "\n== 8) Asset-Überblick (lokal) =="
du -sh assets 2>/dev/null | awk '{print "  assets: " $1}' | tee -a "$OUT"
du -sh themen  2>/dev/null | awk '{print "  themen: " $1}'  | tee -a "$OUT"

say "\n== Fertig =="
say "Bericht: $OUT"
