(function(){
  async function fetchText(url){
    try{ const r=await fetch(url,{cache:'no-store'}); return r.ok?await r.text():""; }catch(e){ return ""; }
  }
  async function buildIndex(){
    try{
      const res = await fetch('data/search-index.json',{cache:'no-store'}).then(r=>r.json());
      if(res && res.docs) return res;
    }catch(e){}
    const pages=[
      'themen/sanierung-foerderung.html','themen/waermepumpe.html','themen/eeg-kompakt.html',
      'themen/zins-und-finanzierung.html','themen/mieter-rechte.html','themen/immobilienpreise-2025.html',
      'themen/mieten-kaufen.html','themen/hypotheken-rechner.html','themen/grundriss-tricks.html','themen/homestaging.html'
    ];
    const idx=[];
    for(const p of pages){
      const html=await fetchText(p);
      const text=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').toLowerCase().slice(0,4000);
      idx.push({title:p.replace('themen/','').replace('.html',''), url:p, text});
    }
    return {docs:idx};
  }
  window.searchSite = async function(){
    const box=document.getElementById('newsQuery'); const out=document.getElementById('searchResult');
    if(!box||!out){ return; }
    const q=(box.value||'').trim().toLowerCase();
    if(!q){ out.innerHTML='<span class="small-muted">Bitte Suchwort.</span>'; return; }
    const data=await buildIndex(); const hits=(data.docs||[]).filter(d=>d.text.includes(q)).slice(0,8);
    out.innerHTML = hits.length ? '<ul>'+hits.map(h=>`<li><a href="${h.url}">${h.title}</a></li>`).join('')+'</ul>'
                                : '<span class="small-muted">Keine Treffer.</span>';
  }
})();
