/* ---------- Helper ---------- */
const $ = (sel, root=document) => root.querySelector(sel);
const create = (tag, attrs={}) => Object.assign(document.createElement(tag), attrs);
const fmtDate = (iso) => { try{ return new Date(iso).toLocaleDateString('de-DE'); } catch { return ''; } };
const fetchJSON = async (url) => { try { const r = await fetch(url,{cache:'no-store'}); if(!r.ok) throw 0; return await r.json(); } catch { return null; } };

/* ---------- Render: News ---------- */
async function renderNews(){
  const root = $('#news-list');
  if(!root) return;
  const data = await fetchJSON('data/news.json') || [];
  if(!data.length){ root.innerHTML = '<li class="text-muted">Keine News vorhanden.</li>'; return; }
  root.innerHTML = data
    .sort((a,b)=>new Date(b.date)-new Date(a.date))
    .slice(0,12)
    .map(n => `<li class="mb-2">
      <a href="${n.link||'#'}" target="_blank" rel="noopener">${n.title}</a>
      <div class="small text-muted">${fmtDate(n.date)}</div>
    </li>`).join('');
}

/* ---------- Render: Listings ---------- */
async function renderListings(){
  const grid = $('#listings-grid');
  if(!grid) return;
  const data = await fetchJSON('data/listings.json') || [];
  if(!data.length){ grid.innerHTML = '<div class="text-muted">Noch keine Angebote.</div>'; return; }
  grid.innerHTML = data.slice(0,12).map(x=>{
    const img = (x.images && x.images[0]) || 'https://source.unsplash.com/600x400/?architecture,interior';
    return `
      <div class="col-md-4 mb-3">
        <a class="card h-100 text-reset text-decoration-none" href="${x.page||'#'}" target="_blank" rel="noopener">
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
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderNews();
  renderListings();
});
