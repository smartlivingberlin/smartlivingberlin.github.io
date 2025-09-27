const CACHE='slb-v1';
const PRECACHE=[
  '/', 'index.html',
  'assets/js/include.js','assets/js/cf_charts.js','assets/js/map.js','assets/js/search.js','assets/js/i18n.js',
  'data/crowdfunding.json','data/investors.json','data/services.json','data/projects.json','data/events.json','data/search_index.json'
].filter(Boolean);

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, clone));
      return res;
    }).catch(()=>caches.match('/')))
  );
});
