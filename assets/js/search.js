(async function(){
  const out=document.getElementById('searchHits'), inp=document.getElementById('qGlobal'), btn=document.getElementById('btnSearch');
  if(!out||!inp||!btn) return;
  const s=document.createElement('script'); s.src="https://cdn.jsdelivr.net/npm/lunr/lunr.min.js"; await new Promise(r=>{s.onload=r;document.head.appendChild(s);});
  const res=await fetch('data/search_index.json',{cache:'no-store'}); const docs=await res.json();
  const idx=lunr(function(){ this.ref('id'); this.field('title'); this.field('text'); this.field('type'); docs.forEach((d,i)=>this.add({...d,id:i}),this); });
  function run(){ const q=(inp.value||'').trim(); if(!q){out.innerHTML='<div class="small text-muted">Suchbegriff eingeben.</div>'; return;}
    const hits=idx.search(q).slice(0,30);
    out.innerHTML = hits.length? '<ul class="list-unstyled">'+hits.map(h=>{const d=docs[h.ref]||{}; return `<li class="mb-2"><span class="badge bg-light text-dark">${d.type||''}</span> <strong>${d.title||'(ohne Titel)'}</strong><div class="small text-muted">${(d.text||'').slice(0,160)}…</div></li>`}).join('')+'</ul>' : '<div class="small text-muted">Keine Treffer.</div>';
  }
  btn.addEventListener('click', run);
  inp.addEventListener('keydown', e=>{ if(e.key==='Enter') run(); });
})();
