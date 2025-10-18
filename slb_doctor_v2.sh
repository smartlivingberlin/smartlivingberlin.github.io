#!/usr/bin/env bash
set -euo pipefail
say(){ printf "\033[32m%s\033[0m\n" "$*"; }
warn(){ printf "\033[33m%s\033[0m\n" "$*"; }
err(){ printf "\033[31m%s\033[0m\n" "$*"; }

test -f index.html || { err "index.html nicht gefunden – bist du im Repo-Root?"; exit 1; }

ts=$(date +%Y%m%d-%H%M%S)
ver=$(date +%s)

say "Backup anlegen"
cp -v index.html "index.html.pre-$ts.bak"
mkdir -p assets/js assets/css assets/images data partials sections

say "1) Kaputte Funktionsnamen (i18n-Fragmente) reparieren"
sed -i -E 's/(renderListFrom)<span[^>]*>[^<]*<\/span>/\1News/g' index.html
sed -i -E 's/(load)<span[^>]*>[^<]*<\/span>/\1News/g' index.html

say "2) Doppelte Includes (crowdfunding/investors/chart.js) aufräumen"
awk '
/\{\% include .*(sections\/crowdfunding\.html).*\%\}/ { if(++cf>1) next }
{\{\% include .*(sections\/investors\.html).*\%\}} { if(++inv>1) next }
' RS='\n' ORS='\n' index.html > .tmp 2>/dev/null || true
[ -s .tmp ] && mv .tmp index.html || true
# Chart.js: nur die erste Zeile behalten
awk '/cdn.jsdelivr.net\/npm\/chart.js/{ if(++seen>1) next } { print }' index.html > .tmp && mv .tmp index.html

say "3) Karten-CSS (Themen mit Bildern + Hover) schreiben"
cat > assets/css/cards.css <<'EOF'
#themes .card{position:relative;min-height:220px;border-radius:14px;overflow:hidden;color:#fff;transition:transform .15s ease;}
#themes .card::before{content:"";position:absolute;inset:0;background:var(--bg-img) center/cover no-repeat;transform:scale(1.04);transition:transform .3s ease;}
#themes .card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,37,64,.25),rgba(10,37,64,.75));}
#themes .card:hover::before{transform:scale(1.08)}
#themes .card h5,#themes .card p,#themes .card .btn{position:relative;z-index:2;text-shadow:0 2px 6px rgba(0,0,0,.45);}
EOF

say "4) Feature-Bilder + 3D-Tilt (mit Fallback) installieren"
cat > assets/js/feature-images.js <<'EOF'
(function(){
  const MAP={
    "Immobilien Wissen":"assets/images/hero.jpg",
    "Finanzen":"assets/images/interior1.jpg",
    "Recht":"assets/images/berlin1.jpg",
    "Smart Living":"assets/images/smart1.jpg",
    "Design":"assets/images/design1.jpg",
    "News":"assets/images/news1.jpg",
    "Berlin":"assets/images/berlin2.jpg",
    "Lifestyle":"assets/images/living1.jpg"
  };
  const fallback = t => `https://source.unsplash.com/600x400/?${encodeURIComponent(t)}`;
  const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches;

  function applyCard(card,url){
    card.style.setProperty('--bg-img', `url("${url}")`);
    card.querySelectorAll('.btn').forEach(b=>{
      b.classList.remove('btn-outline-primary'); b.classList.add('btn-light');
    });
    if(fine()){
      card.addEventListener('mousemove', e=>{
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*8;
        const ry=-((e.clientX-r.left)/r.width-.5)*8;
        card.style.transform=`perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', ()=> card.style.transform='perspective(800px) rotateX(0) rotateY(0)');
    }
  }
  function pickURL(title){
    const k=Object.keys(MAP).find(k=>title.toLowerCase().includes(k.toLowerCase()));
    return k?MAP[k]:fallback(title);
  }
  function decorate(){
    document.querySelectorAll('#themes .card').forEach(card=>{
      const t=card.querySelector('h5,.card-title'); if(!t) return;
      const title=(t.textContent||'').trim(); const url=pickURL(title);
      const img=new Image();
      img.onload=()=>applyCard(card,url);
      img.onerror=()=>applyCard(card,fallback('architecture,interior'));
      img.src=url;
    });
  }
  addEventListener('DOMContentLoaded', decorate);
})();
EOF

say "5) Chart-Fallback (lädt Chart.js nur wenn nötig)"
cat > assets/js/chart-fallback.js <<'EOF'
(function(){
  async function ensureChartJS(){
    if(window.Chart) return;
    await new Promise((ok,err)=>{ const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/chart.js'; s.onload=ok; s.onerror=err; document.head.appendChild(s);});
  }
  async function fetchJSON(u){ try{const r=await fetch(u,{cache:'no-store'}); if(!r.ok) throw 0; return r.json();}catch(_){return null;} }
  async function drawDemoChart(id='zinsChart'){
    const el=document.getElementById(id); if(!el) return;
    await ensureChartJS();
    let s=(await fetchJSON('data/charts.json'))?.zins;
    if(!s) s={labels:["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],data:[2.1,2.4,2.8,3.2,3.5,3.7,3.9,4.0,3.7,3.5,3.4,3.3]};
    new Chart(el,{type:'line',data:{labels:s.labels,datasets:[{label:'Zins p. a. (%)',data:s.data,tension:.25}]},
      options:{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>v+'%'}}}}});
  }
  addEventListener('DOMContentLoaded',()=>drawDemoChart());
})();
EOF

say "6) Einbindungen idempotent in index.html ergänzen"
grep -q 'assets/css/cards.css' index.html || \
  sed -i "0,/<\/head>/{s|</head>|  <link rel=\"stylesheet\" href=\"assets/css/cards.css?v=$ver\">\n</head>|}" index.html
grep -q 'assets/js/feature-images.js' index.html || \
  sed -i "/<\/body>/i <script src=\"assets\/js\/feature-images.js?v=$ver\"><\/script>" index.html
grep -q 'assets/js/chart-fallback.js' index.html || \
  sed -i "/<\/body>/i <script src=\"assets\/js\/chart-fallback.js?v=$ver\"><\/script>" index.html
sed -i "s|/sw.js|/sw.js?v=$ver|g" index.html 2>/dev/null || true

say "7) Lokaler Testserver -> http://localhost:8000"
python3 -m http.server 8000 >/dev/null 2>&1 & echo $! > .http_pid
sleep 1
say "OK. Stop mit: kill \$(cat .http_pid)"
