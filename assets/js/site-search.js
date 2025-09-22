(function(){
  async function get(url){ try{ const r=await fetch(url,{cache:'no-store'}); return r.ok?await r.text():""; }catch(e){ return ""; } }
  async function buildIndex(){
    const indexUrl='data/search-index.json';
    try{ const j=await fetch(indexUrl,{cache:'no-store'}).then(r=>r.json()); if(j&&j.docs) return j; }catch(e){}
    return {docs:[]};
  }
  window.searchSite = async function(){
    const q=(document.getElementById('newsQuery')?.value||'').trim().toLowerCase();
    const out=document.getElementById('searchResult'); if(!q){ out.innerHTML='<span class="small-muted">Bitte Suchwort.</span>'; return;}
    const idx=await buildIndex();
    const hits=(idx.docs||[]).filter(d=>d.text.includes(q)).slice(0,12);
    out.innerHTML = hits.length ? '<ul>'+hits.map(h=>`<li><a href="${h.url}">${h.title}</a></li>`).join('')+'</ul>'
                                : '<span class="small-muted">Keine Treffer.</span>';
  }
})();
