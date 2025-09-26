const CACHE='slb-v1';
const ASSETS=[
  '/', 'index.html', 'manifest.webmanifest',
  'assets/js/include.js','assets/js/share.js',
  'assets/js/crowdfunding.js','assets/js/investors.js',
  'sections/crowdfunding.html','sections/investors.html','sections/share.html'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;
    }).catch(()=>caches.match('/'))));
  }
});
