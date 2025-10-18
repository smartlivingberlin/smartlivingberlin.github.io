(async function(){
  const host = document.getElementById('featureGrid') || document.getElementById('baukasten-inner');
  if(!host) return;
  const fetchJSON = async (u)=>{ try{ const r=await fetch(u,{cache:'no-store'}); if(!r.ok) throw 0; return await r.json(); }catch(e){ return []; } };
  const data = await fetchJSON('data/module-liste.json');
  if(!data.length){ host.innerHTML = '<div class="text-muted">Noch keine Module.</div>'; return; }
  host.innerHTML = data.map(item => `
    <a class="card p-0 kachel text-reset" href="${item.link||'#'}" style="overflow:hidden">
      <img src="${item.bild||'https://source.unsplash.com/800x600/?architecture'}" alt="" style="width:100%;height:140px;object-fit:cover">
      <div class="p-3">
        <h5 class="mb-1">${item.titel||''}</h5>
        <div class="small-muted">${item.desc||''}</div>
      </div>
    </a>
  `).join('');
})();
