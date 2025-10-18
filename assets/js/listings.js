(async function(){
  const el = document.getElementById('listings-grid') || document.getElementById('angeboteGrid');
  if(!el) return;
  try{
    const r = await fetch('data/listings.json',{cache:'no-store'});
    const items = (await r.json()) || [];
    if(!items.length){ el.innerHTML='<div class="small text-muted">Noch keine Einträge.</div>'; return; }
    el.innerHTML = items.slice(0,24).map(x=>{
      const img=(x.images&&x.images[0])||'https://source.unsplash.com/600x400/?architecture,interior';
      return `<div class="col-md-4 mb-3">
        <a class="card h-100 text-reset text-decoration-none" href="${x.page||'#'}">
          <img class="card-img-top" loading="lazy" alt="${x.title||''}" src="${img}">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <span class="badge bg-light text-dark">${x.category||''}</span>
              <span class="small text-muted">${x.location||''}</span>
            </div>
            <h5 class="mt-2 mb-1">${x.title||''}</h5>
            <div class="small text-muted">${x.price||''}</div>
          </div>
        </a>
      </div>`;
    }).join('');
  }catch{ el.innerHTML='<div class="small text-muted">Fehler beim Laden.</div>'; }
})();
