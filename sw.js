const CACHE='slb-v1';
const PRECACHE=['/','index.html','assets/js/include.js','assets/js/listings.js','assets/js/news.js','assets/js/law.js','assets/js/gallery.js','assets/js/search.js','assets/js/i18n.js','assets/js/map.js','data/news.json','partials/top5.html','data/listings.json','data/law.json','data/faq.json','data/services.json','data/projects.json','data/events.json','data/search_index.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE.filter(Boolean))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cl=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); return res;}).catch(()=>caches.match('/'))))});
