const https = require('https');
const { parseStringPromise } = require('xml2js');
const fs = require('fs');

const FEEDS = [
  "https://www.tagesschau.de/xml/rss2",                         // Allgemein
  "https://www.handelsblatt.com/contentexport/feed/immobilien", // Immobilien
  "https://www.heise.de/rss/heise-atom.xml",                    // Tech / Smart Living
  "https://www.cleanenergywire.org/rss.xml"                     // Energie/Öko
];

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  let items = [];
  for (const url of FEEDS) {
    try {
      const xml = await fetchURL(url);
      const data = await parseStringPromise(xml, { trim: true, explicitArray: false });
      const ch = data.rss?.channel || data.feed;
      let arr = [];
      if (ch?.item) arr = Array.isArray(ch.item) ? ch.item : [ch.item];
      else if (ch?.entry) arr = Array.isArray(ch.entry) ? ch.entry : [ch.entry];

      const mapped = arr.slice(0, 12).map(it => ({
        title: (it.title?._ || it.title || '').toString().trim(),
        link: (it.link?.href || it.link || '').toString().trim(),
        date: (it.pubDate || it.updated || it.published || '').toString(),
        source: url
      })).filter(x => x.title && x.link);
      items.push(...mapped);
    } catch(e) {
      console.error('Feed error:', url, e.message);
    }
  }
  items.sort((a,b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync('data/news.json', JSON.stringify(items.slice(0, 60), null, 2), 'utf8');
  console.log('OK: wrote data/news.json with', Math.min(items.length,60), 'items');
})();
