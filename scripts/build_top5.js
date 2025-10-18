const fs = require('fs');

const NEWS_JSON = 'data/news.json';
const INDEX = 'index.html';
const START = '<!-- NEWS:START -->';
const END   = '<!-- NEWS:END -->';

function loadNews() {
  const raw = fs.readFileSync(NEWS_JSON, 'utf8');
  const arr = JSON.parse(raw);
  // Sortiere neueste zuerst (nach ISO-Datum)
  return arr
    .map(x => ({...x, date: new Date(x.date || x.pubDate || Date.now()).toISOString()}))
    .sort((a,b) => b.date.localeCompare(a.date))
    .slice(0,5);
}

function renderList(items){
  const li = items.map(it => {
    const date = (it.date || '').slice(0,10);
    const title = it.title || 'Ohne Titel';
    const link = it.link || '#';
    const src  = it.source || '';
    return `<li><a href="${link}" target="_blank" rel="noopener">${title}</a> <small>(${date}${src?`, ${src}`:''})</small></li>`;
  }).join('\n');
  return `<section id="news" class="card">
  <h2>Aktuelle Branchen-News</h2>
  <ul>
  ${li}
  </ul>
</section>`;
}

function replaceInIndex(html, block){
  const i1 = html.indexOf(START);
  const i2 = html.indexOf(END);
  if (i1 === -1 || i2 === -1 || i2 < i1) {
    throw new Error('NEWS Marker nicht gefunden. Bitte START/END Marker in index.html setzen.');
  }
  const before = html.slice(0, i1 + START.length);
  const after  = html.slice(i2);
  return `${before}\n${block}\n${after}`;
}

const news = loadNews();
const block = renderList(news);
const indexHtml = fs.readFileSync(INDEX, 'utf8');
const out = replaceInIndex(indexHtml, block);
fs.writeFileSync(INDEX, out, 'utf8');
console.log(`OK: index.html aktualisiert mit ${news.length} Artikeln.`);
