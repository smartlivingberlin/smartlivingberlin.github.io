(function(){
  async function fetchJSON(url){ try{ const r=await fetch(url,{cache:'no-store'}); return r.ok? r.json(): null; }catch{return null;} }
  async function searchAll(q){
    q=(q||'').toLowerCase();
    const out=[];
    // lokale Arrays, wenn auf Seite definiert
    if(window.FAQ){ window.FAQ.forEach(f=>{ if((f.q+f.a).toLowerCase().includes(q)) out.push({t:'FAQ',h:`<strong>${f.q}</strong><div>${f.a}</div>`}); }); }
    // law.json
    const law=await fetchJSON('data/law.json')||[];
    law.forEach(x=>{ if((x.paragraph||'').toLowerCase().includes(q) || (x.explanation||'').toLowerCase().includes(q)) out.push({t:'Recht',h:`<strong>${x.paragraph}</strong><div>${x.explanation}</div>`}); });
    // news.json
    const news=await fetchJSON('data/news.json')||[];
    news.forEach(n=>{ if((n.title||'').toLowerCase().includes(q)) out.push({t:'News',h:`<a href="${n.link||'#'}" target="_blank" rel="noopener">${n.title}</a> <span class="text-muted">· ${n.date||''}</span>`}); });
    return out;
  }
  window.ask = async function(){
    const box=document.getElementById('q'); const q=box? box.value: '';
    const tgt=document.getElementById('answers');
    if(!tgt) return;
    tgt.innerHTML='<div class="text-muted">Suche…</div>';
    const hits=await searchAll(q);
    tgt.innerHTML = hits.length ? hits.map(x=>`<div class="mb-2">${x.h}</div>`).join('') :
      '<div class="text-muted">Keine passenden Einträge gefunden.</div>';
  };
})();
