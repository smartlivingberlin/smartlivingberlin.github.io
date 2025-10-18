const https = require('https');
const { parseStringPromise } = require('xml2js');
const fs = require('fs');

const FEEDS = [
  "https://www.tagesschau.de/xml/rss2/",
  "https://www.handelsblatt.com/contentexport/feed/immobilien",
  "https://www.heise.de/rss/heise-atom.xml",
nano scripts/fetch_rss.js
const https = require('https');
const { parseStringPromise } = require('xml2js');
const fs = require('fs');

const FEEDS = [
  "https://www.tagesschau.de/xml/rss2/",
  "https://www.handelsblatt.com/contentexport/feed/immobilien/",
  "https://www.heise.de/rss/heise-atom.xml",
  "https://www.cleanenergywire.org/rss.xml"
];

async function fetchFeed(url) {
  return new Promise((resolve) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', async () => {
        try {
          const result = await parseStringPromise(data);
          const items = result.rss?.channel?.[0]?.item || result.feed?.entry || [];
          const mapped = items.map(it => ({
            title: (it.title?.[0] ?? it['title']?.[0]?._ ?? "Ohne Titel").toString(),
            link:  (it.link?.[0]?.href ?? it.link?.[0] ?? it['link']?.[0]?.$.href ?? "").toString(),
            date:  (it.pubDate?.[0] ?? it.updated?.[0] ?? new Date().toISOString()).toString(),
            source: url
          }));
          resolve(mapped);
        } catch (err) {
          console.error('❌ Fehler beim Parsen von', url, err.message);
          resolve([]);
        }
      });
    }).on('error', err => {
      console.error('⚠️ Netzwerkfehler bei', url, err.message);
      resolve([]);
    });
  });
}

(async () => {
  let allNews = [];
  for (const feed of FEEDS) {
    const news = await fetchFeed(feed);
    allNews = allNews.concat(news);
  }
  // Duplikate nach Link entfernen und nach Datum sortieren
  const unique = Array.from(new Map(allNews.map(n => [n.link, n])).values())
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync('data/news.json', JSON.stringify(unique, null, 2));
  console.log('✅ Fertig! data/news.json mit', unique.length, 'Artikeln erstellt.');
})();
  "https://www.cleanenergywire.org/rss.xml"
];

async function fetchFeed(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', async () => {
        try {
          const result = await parseStringPromise(data);
          const items = result.rss?.channel?.[0]?.item || result.feed?.entry || [];
          resolve(items.map(item => ({
            title: item.title?.[0] || "Ohne Titel",
            link: item.link?.[0]?.$.href || item.link?.[0] || "#",
            date: item.pubDate?.[0] || item.updated?.[0] || new Date().toISOString(),
            source: url
          })));
        } catch (err) {
          console.error("Fehler beim Parsen von", url, err.message);
          resolve([]);
        }
      });
    }).on('error', err => {
      console.error("Netzwerkfehler bei", url, err.message);
      resolve([]);
    });
  });
}

(async () => {
  let allNews = [];
  for (const url of FEEDS) {
    const news = await fetchFeed(url);
    allNews = allNews.concat(news);
  }
  fs.writeFileSync("data/news.json", JSON.stringify(allNews, null, 2));
  console.log("✅ Fertig! news.json mit", allNews.length, "Artikeln erstellt.");
})();
