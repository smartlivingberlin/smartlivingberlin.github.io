(function(){
  async function fetchText(url){ try{const r=await fetch(url); return r.ok?await r.text():"";}catch(e){return "";} }
  async function buildIndex(){
    const pages=['themen/sanierung-foerderung.html','themen/waermepumpe.html','themen/eeg-kompakt.html',
      'themen/zins-und-finanzierung.html','themen/mieter-rechte.html','themen/immobilienpreise-2025.html',
      'themen/mieten-kaufen.html','themen/hypotheken-rechner.html','themen/grundriss-tricks.html','themen/homestaging.html'];
    const idx=[];
    for(const p of pages){ const html=await fetchText(p); const text=html.replace(/<[^>]+>/g,' ').slice(0,2000);
      idx.push({title:p.replace('themen/','').replace('.html',''),url:p,text}); }
    return {docs:idx};
  }
  window.searchSite=async function(){
    const q=(document.getElementById('newsQuery')?.value||'').trim().toLowerCase();
    const out=document.getElementById('searchResult'); if(!q){out.innerHTML='Bitte Suchwort.';return;}
    const data=await buildIndex(); const hits=data.docs.filter(d=>d.text.toLowerCase().includes(q)).slice(0,8);
    out.innerHTML=hits.length?'<ul>'+hits.map(h=>`<li><a href="${h.url}">${h.title}</a></li>`).join('')+'</ul>':'Keine Treffer.';
  }
})();
