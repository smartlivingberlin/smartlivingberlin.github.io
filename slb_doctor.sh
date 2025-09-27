#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/smartlivingberlin.github.io"
FILE="$REPO/index.html"
DO_COMMIT=0   # auf 1 setzen, wenn du nachher automatisch commit/push willst

say(){ printf "\033[1;34m•\033[0m %s\n" "$*"; }
ok(){ printf "\033[1;32m✓\033[0m %s\n" "$*"; }
warn(){ printf "\033[1;33m!\033[0m %s\n" "$*"; }
err(){ printf "\033[1;31m✗\033[0m %s\n" "$*"; }

# 0) Repo prüfen
cd "$REPO" || { err "Repo nicht gefunden: $REPO"; exit 1; }
git rev-parse --show-toplevel >/dev/null 2>&1 || { err "Kein Git-Repo hier."; exit 1; }
ok "Git-Repo: $(git rev-parse --show-toplevel)"

# 1) Backups
ts=$(date +%F_%H%M%S)
cp -v "$FILE" "$FILE.pre-$ts.bak"
mkdir -p assets/js assets/images data partials sections

# 2) i18n-Fehler in Funktionsnamen reparieren
say "Repariere i18n-Fragmente in Funktionsnamen…"
sed -i -E 's/renderListFrom<span[^>]*>[^<]*<\/span>/renderListFrom/g' "$FILE"
sed -i -E 's/load<span[^>]*>[^<]*<\/span>/load/g' "$FILE"
ok "Funktionsnamen gefixt"

# 3) Dubletten aufräumen (Includes & Chart.js)
say "Bereinige doppelte Includes & Chart.js…"
# a) Jekyll-Includes: crowd-/investors je max. 1x behalten
for inc in "sections/crowdfunding.html" "sections/investors.html"; do
  # entferne alle Vorkommen und füge genau eins am Ende vor </body> wieder ein
  cnt=$(grep -c "{% include '$inc' %}" "$FILE" || true)
  if [ "${cnt:-0}" -gt 1 ]; then
    sed -i "s/{% include '$inc' %}//g" "$FILE"
    sed -i "s#</body>#\n{% include '$inc' %}\n</body>#g" "$FILE"
    ok "$inc: Duplikate entfernt (1x beibehalten)"
  fi
done
# b) Chart.js: alle Vorkommen entfernen, genau 1x mit CDN neu anhängen
if grep -q 'cdn.jsdelivr.net/npm/chart.js' "$FILE" || grep -q 'assets/js/chart.js' "$FILE"; then
  sed -i -E '/chart\.js/d' "$FILE"
  sed -i "s#</body>#\n<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n</body>#g" "$FILE"
  ok "Chart.js auf 1x CDN vereinheitlicht"
fi

# 4) Leaflet + MarkerCluster sicherstellen (CSS ist bereits in HEAD – JS nachziehen)
say "Prüfe MarkerCluster-Script…"
grep -q 'leaflet.markercluster' "$FILE" || \
  sed -i '/leaflet.js/s|$|\n<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>|' "$FILE"
ok "MarkerCluster-Script eingebunden (falls fehlend)"

# 5) Robustere Feature-Bilder-Logik installieren (mit Fallback, ohne Layout-Shift)
say "Installiere robustes assets/js/feature-images.js…"
cat > assets/js/feature-images.js <<'JS'
(function(){
  const MAP = {
    "Immobilien Wissen":"assets/images/hero.jpg",
    "Finanzen":"assets/images/interior1.jpg",
    "Recht":"https://source.unsplash.com/600x400/?law,justice",
    "Smart Living":"https://source.unsplash.com/600x400/?smart,home",
    "Design":"https://source.unsplash.com/600x400/?interior,design",
    "Homestaging":"https://source.unsplash.com/600x400/?homestaging",
    "Berlin":"https://source.unsplash.com/600x400/?berlin,architecture",
    "Lifestyle":"assets/images/living1.jpg"
  };

  // sanfter Tilt nur auf großen Screens
  const enableTilt = () => window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  function preload(url, onOK, onFail){
    const img = new Image();
    img.onload = ()=>onOK(url);
    img.onerror = ()=>onFail();
    img.src = url;
  }

  function decorateCard(card){
    const h = card.querySelector('h5,h4,h3'); if(!h) return;
    const title = (h.textContent||'').trim();
    const key = Object.keys(MAP).find(k => title.includes(k));
    const guess = key ? MAP[key] : `https://source.unsplash.com/600x400/?${encodeURIComponent(title)}`;
    const fallbackCSS = 'linear-gradient(135deg,#0a2540,#143b6a)';

    const applyBG = (urlOrCss, isCss=false)=>{
      card.style.position = 'relative';
      card.style.minHeight = '200px';
      card.style.background = isCss ? urlOrCss : `url("${urlOrCss}") center/cover no-repeat`;
      card.style.color = '#fff';
      card.style.boxShadow = '0 10px 20px rgba(0,0,0,.08)';
      card.style.transition = 'transform .25s ease, box-shadow .25s ease';
      let ov = card.querySelector('.img-overlay');
      if(!ov){ ov = document.createElement('div'); ov.className='img-overlay'; card.appendChild(ov); }
      ov.style.position='absolute'; ov.style.inset='0'; ov.style.borderRadius='14px';
      ov.style.background='linear-gradient(180deg, rgba(10,37,64,.15), rgba(10,37,64,.6))';
      h.style.textShadow='0 1px 2px rgba(0,0,0,.55)';
      if(enableTilt()){
        card.addEventListener('mousemove', e=>{
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left)/r.width - .5;
          const y = (e.clientY - r.top)/r.height - .5;
          card.style.transform = `perspective(800px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', ()=>{ card.style.transform='perspective(800px) rotateX(0) rotateY(0) scale(1)'; });
      }
    };

    preload(guess,
      url => applyBG(url,false),
      () => applyBG(fallbackCSS,true)
    );
  }

  function decorate(selector){
    document.querySelectorAll(selector).forEach(decorateCard);
  }

  // nur diese Bereiche bebildern
  decorate('#themes .card');
  decorate('#featureGrid .card');
})();
JS

# sicherstellen, dass Script eingebunden ist
grep -q 'assets/js/feature-images.js' "$FILE" || \
  sed -i 's#</body>#<script src="assets/js/feature-images.js" defer></script>\n</body>#' "$FILE"
ok "Feature-Bilder Script aktiv"

# 6) JSON-Dateien validieren, minimal erzeugen falls fehlend
say "Validiere JSON-Dateien…"
mkjson(){ [ -f "$1" ] || { echo "[]" > "$1"; warn "erstellt: $1 (leer)"; }; python3 - <<PY || { err "Ungültiges JSON in $1"; exit 1; }
import json,sys
json.load(open("$1","r",encoding="utf-8"))
print("ok")
PY
}
mkjson data/news.json
mkjson data/charts.json
mkjson data/listings.json
mkjson data/module-liste.json
mkjson data/faq.json
ok "JSON geprüft"

# 7) Lokaler Start & Reachability
say "Starte lokalen Testserver…"
python3 -m http.server 8000 >/dev/null 2>&1 & SLPID=$!
sleep 1
if curl -sf "http://localhost:8000/" >/dev/null; then
  ok "Startseite erreichbar"
else
  err "Startseite nicht erreichbar"
fi
kill "$SLPID" 2>/dev/null || true

# 8) Zusammenfassung (Marker im HTML)
say "HTML Marker Diagnose:"
python3 - <<'PY'
import re,sys,io
ix=open("index.html","r",encoding="utf-8").read()
def has(p): 
  print(("✓" if re.search(p,ix,re.S) else "✗"), p)
has(r'sections/map\.html')
has(r'sections/crowd_charts\.html|crowd_charts\.html')
has(r'assets/js/feature-images\.js')
has(r'leaflet\.markercluster')
has(r'cdn\.jsdelivr\.net/npm/chart\.js')
PY

# 9) Optional Commit/Push
if [ "$DO_COMMIT" -eq 1 ]; then
  say "Commit & Push…"
  git add -A
  git commit -m "SLB Doctor: i18n-Fix, Dubletten weg, MarkerCluster, robuste Feature-Bilder, JSON-Check"
  git push
  ok "Änderungen gepusht"
else
  warn "Kein Commit/Push (DO_COMMIT=0). Prüfe die Seite, dann optional committen."
fi

ok "Fertig."
