/* Utils */
const fmtDate = iso => { try{return new Date(iso).toLocaleDateString('de-DE')}catch{return ''} };
const fetchJSON = async (u)=>{ try{ const r=await fetch(u,{cache:'no-store'}); if(!r.ok) throw 0; return await r.json(); }catch(e){ return null; } };

/* Baukasten */
const FEATURES = [
  {title:"Immobilien Wissen",desc:"Kaufen/Verkaufen/Mieten verständlich.",link:"#recht",type:"faq",icon:"bi-house-door"},
  {title:"Finanzen",desc:"Kredit, Förderung, Steuern kompakt.",link:"#finanzen",type:"calc",icon:"bi-piggy-bank"},
  {title:"Recht",desc:"BGB & WEG in Alltagssprache.",link:"#recht",type:"law",icon:"bi-balance-scale"},
  {title:"Smart-Home Spartipps",desc:"Was lohnt sich?",link:"#smart",type:"table",icon:"bi-lightning"},
  {title:"Mieten vs. Kaufen",desc:"Vergleich inkl. NK.",link:"#finanzen",type:"calc",icon:"bi-graph-up"},
  {title:"Hypotheken-Rechner",desc:"Rate & Gesamtzahlung.",link:"#finanzen",type:"calc_ann",icon:"bi-cash-coin"},
  {title:"Energiepreise verstehen",desc:"Trends erkennen.",link:"#news",type:"chart",icon:"bi-activity"},
  {title:"Glossar & FAQ",desc:"Begriffe einfach.",link:"#recht",type:"faq",icon:"bi-journal-text"}
];
function renderFeatures(){
  const grid=document.getElementById('featureGrid'); if(!grid) return;
  grid.innerHTML = FEATURES.map((f,i)=>`
    <div class="card p-3">
      <div class="d-flex align-items-center gap-3 mb-1">
        <i class="bi ${f.icon||'bi-stars'} icon-xl text-secondary"></i>
        <h5 class="mb-0">${f.title}</h5>
      </div>
      <p class="small-muted mb-2">${f.desc}</p>
      <div class="d-flex gap-2">
        <a href="${f.link}" class="btn btn-sm btn-outline-primary">Öffnen</a>
        <button class="btn btn-sm btn-success" onclick="openFeature(${i})">Interaktiv</button>
      </div>
    </div>`).join('');
}
function openFeature(i){
  const f=FEATURES[i];
  const m=new bootstrap.Modal('#featureModal'); // Modal existiert nur auf manchen Seiten – safe guard
  const body=document.getElementById('featureBody'); const title=document.getElementById('featureTitle'); const link=document.getElementById('featureLink');
  if(!body||!title||!link||!m) { location.hash=f.link; return; }
  title.textContent=f.title; link.href=f.link||'#';
  const widgets={
    chart:`<canvas id="modalChart" height="180"></canvas><p class="small-muted mt-2">Demo-Chart nutzt <code>data/charts.json</code>, wenn vorhanden.</p>`,
    faq:`<div id="faqModal"></div>`,
    law:`<div class="input-group"><input id="lawIn2" class="form-control" placeholder="§ 556 BGB"><button class="btn btn-dark" onclick="explainLaw(true)">Erklären</button></div><div id="lawOut2" class="mt-3"></div>`,
    calc:`<div class="row g-2 mt-1"><div class="col"><input id="mieteX" class="form-control" placeholder="Miete/Monat" value="1500"></div><div class="col"><input id="preisX" class="form-control" placeholder="Kaufpreis" value="520000"></div><div class="col"><input id="eqX" class="form-control" placeholder="Eigenkapital" value="80000"></div></div><button class="btn btn-primary mt-2" onclick="rentBuy(true)">Vergleichen</button><div id="rbOut2" class="mt-3"></div>`,
    calc_ann:`<div class="row g-2 mt-1"><div class="col"><input id="loanX" class="form-control" placeholder="Kreditsumme" value="350000"></div><div class="col"><input id="rateX" class="form-control" placeholder="Zins %" value="3.8"></div><div class="col"><input id="yearsX" class="form-control" placeholder="Laufzeit" value="25"></div></div><button class="btn btn-primary mt-2" onclick="calcAnn(true)">Berechnen</button><div id="annOut2" class="mt-3"></div>`,
    table:`<div class="table-responsive"><table class="table table-sm"><thead><tr><th>Gerät</th><th>Nutzen</th><th>Preis</th><th>Ersparnis</th></tr></thead><tbody id="smartTableModal"></tbody></table></div>`,
    gallery:`<div class="grid cols-3" id="galleryModal"></div>`
  };
  body.innerHTML = widgets[f.type] || `<p>Interaktive Ansicht folgt.</p>`;
  m.show();
  if(f.type==='table') renderSmart('smartTableModal');
  if(f.type==='gallery') renderGallery('galleryModal');
  if(f.type==='chart') setTimeout(()=>drawDemoChart('modalChart'),50);
}

/* News */
async function loadNews(){
  const list=document.getElementById('news-list'); if(!list) return;
  const data=await fetchJSON('data/news.json');
  const items=Array.isArray(data)&&data.length ? data.sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,12)
    : [{title:"Demo: Smart-Living 2025 – KI spart Energie", link:"#", date:new Date().toISOString()}];
  list.innerHTML = items.map(n=>`<li><a href="${n.link||'#'}" target="_blank" rel="noopener">${n.title}</a><div class="small-muted">${fmtDate(n.date)}</div></li>`).join('');
  try{ const r=await fetch('partials/top5.html',{cache:'no-store'}); document.getElementById('top5-container').innerHTML=r.ok?await r.text():'–'; }catch{}
}
function searchSite(){
  const q=(document.getElementById('newsQuery')?.value||'').toLowerCase();
  const out=document.getElementById('searchResult'); if(!out) return;
  (async()=>{
    const news=await fetchJSON('data/news.json')||[]; const hits=[];
    news.forEach(n=>{ if((n.title||'').toLowerCase().includes(q)) hits.push('News: '+n.title); });
    FAQ.forEach(f=>{ if((f.q+f.a).toLowerCase().includes(q)) hits.push('FAQ: '+f.q); });
    out.innerHTML = hits.length? '<ul><li>'+hits.join('</li><li>')+'</li></ul>' : '<span class="small-muted">Keine Treffer.</span>';
  })();
}

/* Recht & FAQ */
const FAQ = [
  {q:"Was bedeutet § 535 BGB kurz?", a:"Vermieter überlässt/erhält die Wohnung; Mieter zahlt Miete & behandelt die Wohnung pfleglich."},
  {q:"Was sind Betriebskosten?", a:"Laufende Kosten (Heizung, Wasser, Müll). Umlage nur, wenn vereinbart (BetrKV)."},
  {q:"Kaution – wie viel & wann zurück?", a:"Max. 3 Nettokaltmieten; Rückzahlung i. d. R. innerhalb 3–6 Monaten nach Auszug (Prüffrist)."}
];
function renderFAQ(target='faqList'){ const el=document.getElementById(target); if(el) el.innerHTML=FAQ.map(f=>`<details class="mb-2"><summary><strong>${f.q}</strong></summary><p class="mb-1">${f.a}</p></details>`).join(''); }
const LAW_DB={
  "§ 535 BGB":"Überlassen & Erhalten der Mietsache; Miete zahlen.",
  "§ 556 BGB":"Betriebskosten: Umlage/Abrechnung; Fristen beachten.",
  "WEG-Beschluss":"Entscheidungen der Eigentümer – Form/Mehrheit wichtig."
};
async function explainLaw(inModal=false){
  const id=inModal?'lawIn2':'lawInput', out=inModal?'lawOut2':'lawOut';
  const key=(document.getElementById(id)?.value||'').trim();
  const userData=await fetchJSON('data/law.json'); const map={...LAW_DB};
  if(Array.isArray(userData)) userData.forEach(x=>{ if(x.paragraph&&x.explanation) map[x.paragraph]=x.explanation; });
  const txt = map[key] || "Keine Kurz-Erklärung lokal vorhanden. Pflege <code>data/law.json</code>.";
  const el=document.getElementById(out); if(el) el.innerHTML=`<div class="alert alert-light border"><strong>${key||"–"}</strong><div class="mt-2">${txt}</div><div class="small-muted mt-2">*Keine Rechtsberatung.*</div></div>`;
}

/* Finanzen */
function calcAnn(inModal=false){
  const loan=+document.getElementById(inModal?'loanX':'loan').value||0;
  const rate=(+document.getElementById(inModal?'rateX':'rate').value||0)/100/12;
  const n=(+document.getElementById(inModal?'yearsX':'years').value||0)*12;
  const ann=rate>0?loan*rate/(1-Math.pow(1+rate,-n)):loan/n;
  const out=inModal?'annOut2':'annOut';
  document.getElementById(out).innerHTML=`<div class="alert alert-light border"><div><strong>Monatsrate:</strong> ${ann.toFixed(2)} €</div><div><strong>Gesamtzahlung:</strong> ${(ann*n).toFixed(2)} €</div></div>`;
}
function rentBuy(inModal=false){
  const m=+document.getElementById(inModal?'mieteX':'rent').value||0;
  const p=+document.getElementById(inModal?'preisX':'price').value||0;
  const eq=+document.getElementById(inModal?'eqX':'eq').value||0;
  const nk=p*0.09; const kredit=Math.max(0,p-nk-eq);
  const out=inModal?'rbOut2':'rbOut';
  document.getElementById(out).innerHTML=`<div class="alert alert-light border">
    <div><strong>Miete/Jahr:</strong> ${(m*12).toLocaleString('de-DE')} €</div>
    <div><strong>Kaufnebenkosten (~9%):</strong> ${nk.toLocaleString('de-DE')} €</div>
    <div><strong>Benötigter Kredit:</strong> ${kredit.toLocaleString('de-DE')} €</div></div>`;
}

/* Smart Living */
const SMART=[
  {g:"Thermostat", n:"Heiz-Thermostat", price:"€ 60–200", save:"5–12%/Jahr"},
  {g:"Licht", n:"LED + Bewegungsmelder", price:"€ 20–150", save:"2–6%/Jahr"},
  {g:"Steckdosen", n:"Schaltbare Steckdosen", price:"€ 25–80", save:"1–3%/Jahr"},
  {g:"PV-Balkon", n:"Balkonkraftwerk", price:"€ 600–1200", save:"bis 15%/Jahr"}
];
function renderSmart(target='smartTable'){ const el=document.getElementById(target); if(el) el.innerHTML=SMART.map(s=>`<tr><td>${s.n}</td><td>${s.g}</td><td>${s.price}</td><td>${s.save}</td></tr>`).join(''); }
function renderGallery(target='gallery'){
  const el=document.getElementById(target); if(!el) return;
  const topics=["smart home","interior","architecture","minimal","cozy","energy"];
  el.innerHTML=topics.map(t=>`<img decoding="async" class="img-fluid rounded" alt="${t}" loading="lazy" src="https://source.unsplash.com/400x300/?${encodeURIComponent(t)}">`).join('');
}

/* Grundriss */
let planImg=null, blocks=[];
function loadPlan(e){ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ planImg=new Image(); planImg.onload=drawPlan; planImg.src=r.result; }; r.readAsDataURL(f); }
function drawPlan(){ const c=document.getElementById('plannerCanvas'); if(!c) return; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  if(planImg){ const r=Math.min(c.width/planImg.width,c.height/planImg.height); const w=planImg.width*r,h=planImg.height*r; ctx.drawImage(planImg,(c.width-w)/2,(c.height-h)/2,w,h); }
  blocks.forEach(b=>{ ctx.fillStyle='rgba(40,199,111,.25)'; ctx.fillRect(b.x,b.y,b.w,b.h); ctx.strokeStyle='rgba(40,199,111,.9)'; ctx.strokeRect(b.x,b.y,b.w,b.h); });
}
function addBlock(){ blocks.push({x:40+blocks.length*20,y:40,w:80,h:50}); drawPlan(); }
function clearBlocks(){ blocks=[]; drawPlan(); }

/* Chat (lokal) */
function ask(){
  const q=(document.getElementById('q')?.value||'').toLowerCase();
  const out=document.getElementById('answers'); if(!out) return; const hits=[];
  FAQ.forEach(f=>{ if((f.q+f.a).toLowerCase().includes(q)) hits.push(`<div class="mb-2"><strong>${f.q}</strong><div>${f.a}</div></div>`); });
  (async()=>{ const news=await fetchJSON('data/news.json')||[]; news.forEach(n=>{ if((n.title||'').toLowerCase().includes(q)) hits.push(`<div>News: <a href="${n.link||'#'}" target="_blank">${n.title}</a></div>`); });
    out.innerHTML = hits.length? hits.join('') : '<div class="small-muted">Keine passenden Einträge gefunden.</div>'; })();
}

/* Charts */
async function drawDemoChart(id='zinsChart'){
  const ctx=document.getElementById(id); if(!ctx) return;
  let series=null; const charts=await fetchJSON('data/charts.json');
  series = (charts && charts.zins) ? charts.zins :
    {labels:["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"], data:[2.1,2.4,2.8,3.2,3.5,3.7,3.9,4.0,3.7,3.5,3.4,3.3]};
  new Chart(ctx,{type:'line',data:{labels:series.labels,datasets:[{label:'Zins p. a. (%)',data:series.data,tension:.25}]},options:{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>v+'%'}}}}});
}

/* Init */
document.addEventListener('DOMContentLoaded',()=>{ renderFeatures(); renderFAQ(); renderSmart(); renderGallery(); loadNews(); drawDemoChart(); });
