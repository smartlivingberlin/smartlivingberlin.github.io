const fs = require('fs');
const path = require('path');

const INPUT = path.join('data', 'news.json');
const OUTDIR = 'partials';
const OUTPUT = path.join(OUTDIR, 'top5.html');

function readNews() {
  if (!fs.existsSync(INPUT)) {
    console.error('⚠️ news.json nicht gefunden:', INPUT, '- Skript beendet.');
    process.exit(0); // kein harter Fehler, Workflow darf weiterlaufen
  }
  try {
    const raw = fs.readFileSync(INPUT, 'utf8');
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // Nach Datum absteigend sortieren
    return arr
      .slice()
      .sort((a,b) => new Date(b.date) - new Date(a.date))
      .filter(n => n.link && n.title);
  } catch (e) {
    console.error('❌ Konnte news.json nicht parsen:', e.message);
    process.exit(1);
  }
}

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('de-DE'); }
  catch { return ''; }
}

function buildHTML(items) {
  const top = items.slice(0, 5);
  const lis = top.map(n => {
    const d = fmtDate(n.date);
    return `<li><a href="${n.link}" target="_blank" rel="noopener">${n.title}</a>` +
           (d ? ` <small>– ${d}</small>` : '') +
           `</li>`;
  }).join('\n');
  return `<!-- automatisch erzeugt: partials/top5.html -->
<section style="max-width:900px;margin:40px auto">
  <h2>Top 5 der Woche</h2>
  <ul style="line-height:1.6">
${lis || '<li>Zurzeit keine Artikel verfügbar.</li>'}
  </ul>
</section>`;
}

(function main() {
  const news = readNews();
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
  const html = buildHTML(news);
  fs.writeFileSync(OUTPUT, html);
  console.log('✅ Geschrieben:', OUTPUT, 'mit', Math.min(news.length, 5), 'Einträgen.');
})();
