async function getJSON(p){try{const r=await fetch(p,{cache:'no-store'});return r.ok?await r.json():[]}catch(e){return[]}}
async function siteSearch(){
  const q=(document.getElementById('siteQuery').value||'').toLowerCase();
  const out=document.getElementById('siteHits'); out.innerHTML='Suche...';
  const lists = await Promise.all([
    getJSON('data/news.json'), getJSON('data/listings.json'),
    getJSON('data/services.json'), getJSON('data/events.json'),
    getJSON('data/projects.json'), getJSON('data/partners.json'),
    getJSON('data/crowdfunding.json'), getJSON('data/investors.json')
  ]);
  const names=['News','Listings','Services','Events','Projekte','Partner','Crowdfunding','Investoren'];
  const hits=[];
  lists.forEach((arr,i)=> (arr||[]).forEach(x=>{
    const text=(JSON.stringify(x)||'').toLowerCase();
    if(text.includes(q)) hits.push({cat:names[i], item:x});
  }));
  out.innerHTML = hits.length
    ? '<ul>'+hits.slice(0,50).map(h=>`<li><strong>${h.cat}:</strong> ${(h.item.title||h.item.name||h.item.focus||'Eintrag')}</li>`).join('')+'</ul>'
    : '<span class="small-muted">Keine Treffer.</span>';
}
document.addEventListener('DOMContentLoaded',()=>{
  const box=document.getElementById('siteSearchBox'); if(!box) return;
  box.innerHTML=`<div class="card p-3"><h5>Seitensuche</h5><input id="siteQuery" class="form-control" placeholder="Begriff (z. B. Wärmepumpe, Investor, Prenzlauer)"><button class="btn btn-primary mt-2" onclick="siteSearch()">Suchen</button><div id="siteHits" class="mt-2"></div></div>`;
});
