(async function () {
  const $ = (sel) => document.querySelector(sel);
  const byId = (id) => document.getElementById(id);
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('de-DE'); } catch { return ''; } };

  // Daten holen
  let DB = {};
  try {
    const r = await fetch('data/content.json', { cache: 'no-store' });
    DB = await r.json();
    window.DB = DB;
  } catch (e) {
    console.warn('content.json nicht ladbar', e);
    return;
  }

  // LISTINGS
  const grid = byId('angeboteGrid');
  if (grid && Array.isArray(DB.listings)) {
    grid.innerHTML = DB.listings.slice(0, 12).map(x => {
      const img = (x.images && x.images[0]) || 'https://source.unsplash.com/600x400/?architecture,interior';
      return `
      <div class="col-md-4 mb-3">
        <a class="card h-100" href="${x.page || '#'}">
          <img class="card-img-top" loading="lazy" alt="${x.title || ''}" src="${img}">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <span class="badge bg-light text-dark">${x.category || ''}</span>
              <span class="small text-muted">${x.location || ''}</span>
            </div>
            <h5 class="mt-2 mb-1">${x.title || ''}</h5>
            <div class="text-muted">${x.price || ''}</div>
          </div>
        </a>
      </div>`;
    }).join('');
  }

  // FAQ
  const faqTarget = byId('faqList');
  if (faqTarget && Array.isArray(DB.faq)) {
    faqTarget.innerHTML = DB.faq.map(f => `<details class="mb-2"><summary><strong>${f.q}</strong></summary><p class="mb-1">${f.a}</p></details>`).join('');
  }

  // PARAGRAPH QUICK LOOKUP
  window.explainLaw = function (inModal = false) {
    const id = inModal ? 'lawIn2' : 'lawInput';
    const out = inModal ? 'lawOut2' : 'lawOut';
    const key = (byId(id)?.value || '').trim();
    const map = Object.fromEntries((DB.laws || []).map(x => [x.paragraph, x.explanation]));
    const txt = map[key] || "Keine Kurz-Erklärung lokal vorhanden. Versuche allgemeine Begriffe oder erweitere data/content.json.";
    if (byId(out)) byId(out).innerHTML = `<div class="alert alert-light border"><div><strong>${key || '–'}</strong></div><div class="mt-2">${txt}</div><div class="small text-muted mt-2">*Keine Rechtsberatung.*</div></div>`;
  };

  // NEWS
  const newsList = byId('news-list');
  if (newsList) {
    const items = (DB.news || []).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12);
    newsList.innerHTML = items.map(n => `<li><a href="${n.link || '#'}" target="_blank" rel="noopener">${n.title}</a><div class="text-muted small">${fmtDate(n.date)}</div></li>`).join('');
  }
  const top5 = byId('top5-container');
  if (top5 && Array.isArray(DB.top5)) {
    top5.innerHTML = DB.top5.map(t => `<div><a href="javascript:void(0)" onclick="openByTitle('${t.replace(/'/g, "\\'")}')">${t}</a></div>`).join('');
  }

  // SMART LIVING TABELLE
  const smartTable = byId('smartTable');
  if (smartTable && Array.isArray(DB.smart_devices)) {
    smartTable.innerHTML = DB.smart_devices.map(s => `<tr><td>${s.n}</td><td>${s.g}</td><td>${s.price}</td><td>${s.save}</td></tr>`).join('');
  }

  // GALLERY
  const gal = byId('gallery');
  if (gal && Array.isArray(DB.gallery_topics)) {
    gal.innerHTML = DB.gallery_topics.map(t => `<img class="img-fluid rounded" loading="lazy" alt="${t}" src="https://source.unsplash.com/400x300/?${encodeURIComponent(t)}">`).join('');
  }

  // CHARTS (Zins)
  if (window.Chart && byId('zinsChart') && DB.charts?.zins) {
    const z = DB.charts.zins;
    new Chart(byId('zinsChart'), {
      type: 'line',
      data: { labels: z.labels, datasets: [{ label: 'Zins p. a. (%)', data: z.data, tension: .25 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => v + '%' } } } }
    });
  }

  // SIMPLE SEARCH (News+FAQ)
  window.searchSite = function () {
    const q = (document.getElementById('newsQuery')?.value || '').toLowerCase();
    const out = document.getElementById('searchResult');
    if (!out) return;
    const hits = [];
    (DB.news || []).forEach(n => { if ((n.title || '').toLowerCase().includes(q)) hits.push('News: ' + n.title); });
    (DB.faq  || []).forEach(f => { if ((f.q + f.a).toLowerCase().includes(q)) hits.push('FAQ: ' + f.q); });
    out.innerHTML = hits.length ? '<ul><li>' + hits.join('</li><li>') + '</li></ul>' : '<span class="text-muted small">Keine Treffer.</span>';
  };
})();
