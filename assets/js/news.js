(async function(){
  const list=document.getElementById('news-list');
  if(!list) return;
  async function fetchJSON(u){ try{ const r=await fetch(u,{cache:'no-store'}); return r.ok? await r.json():null; }catch{return null;} }
  const data=await fetchJSON('data/news.json');
  const items=Array.isArray(data)&&data.length ? data.sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,24)
    : [{title:"Demo: Smart-Living 2025 – KI spart Energie", link:"#", date:new Date().toISOString()}];
  list.innerHTML=items.map(n=>`<li class="mb-2">
    <a href="${n.link||'#'}" target="_blank" rel="noopener">${n.title}</a>
    <div class="small text-muted">${new Date(n.date).toLocaleDateString('de-DE')} · ${(n.link?new URL(n.link).hostname:'')}</div>
  </li>`).join('');
  try{
    const r=await fetch('partials/top5.html',{cache:'no-store'});
    document.getElementById('top5-container').innerHTML = r.ok? await r.text() : 'Noch kein Top-5 Snippet.';
  }catch{ document.getElementById('top5-container').textContent=''; }

  // Mini-Suche
  const q=document.getElementById('newsQuery'), out=document.getElementById('searchResult'), btn=document.getElementById('btnNewsSearch');
  function run(){
    const s=(q.value||'').toLowerCase(); const hits = (data||[]).filter(n=>(n.title||'').toLowerCase().includes(s)).slice(0,20);
    out.innerHTML = hits.length ? '<ul><li>'+hits.map(h=>`<a href="${h.link}" target="_blank">${h.title}</a>`).join('</li><li>')+'</li></ul>' : '<span class="small text-muted">Keine Treffer.</span>';
  }
  btn?.addEventListener('click', run);
})();
