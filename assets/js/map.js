async function slbLoadMap(){
  const el = document.getElementById('slbMap'); if(!el) return;
  const map = L.map(el).setView([52.5208,13.4095], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);

  const sets = [
    {url:'data/services.json', icon:'🔧', color:'#0a58ca', get:(x)=>({lat:x.lat,lng:x.lng, title:x.name, desc:(x.category||'')+' · '+(x.region||''), link:x.website})},
    {url:'data/projects.json', icon:'🏗️', color:'#28c76f', get:(x)=>({lat:x.lat,lng:x.lng, title:x.title, desc:x.status||'', link:x.link})},
    {url:'data/events.json',   icon:'📅', color:'#f39c12', get:(x)=>({lat:x.lat,lng:x.lng, title:x.title, desc:x.date||'', link:x.link||'#'})}
  ];

  for(const s of sets){
    try{
      const r=await fetch(s.url,{cache:'no-store'}); const arr=await r.json();
      arr.filter(x=>x.lat&&x.lng).forEach(x=>{
        const d=s.get(x);
        const m=L.circleMarker([+d.lat,+d.lng],{radius:7,color:s.color,weight:2,fillOpacity:.15}).addTo(map);
        m.bindPopup(`<strong>${s.icon} ${d.title||''}</strong><div>${d.desc||''}</div>${d.link?`<div><a href="${d.link}" target="_blank">Mehr</a></div>`:''}`);
      });
    }catch(e){ console.warn('Map load failed for', s.url, e); }
  }
}
document.addEventListener('DOMContentLoaded', slbLoadMap);
