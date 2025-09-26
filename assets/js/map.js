(function(){
  let map, clusters, raw = {services:[], projects:[], events:[]}, visible=[];

  function normalize(x){ return (x||'').toString().toLowerCase(); }
  function matchesSearch(item, q){
    if(!q) return true;
    const s = normalize(q);
    return [item.title,item.desc,item.category,item.region].some(v => normalize(v).includes(s));
  }
  function csvEscape(v){ return `"${(v??'').toString().replace(/"/g,'""')}"`; }
  function toCSV(rows){
    const head = ['type','title','desc','lat','lng','link'];
    const body = rows.map(r=>[r.type,r.title,r.desc,r.lat,r.lng,r.link].map(csvEscape).join(','));
    return [head.join(','), ...body].join('\n');
  }
  function downloadCSV(name, text){
    const blob = new Blob([text],{type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  async function loadJSON(url){ try{ const r=await fetch(url,{cache:'no-store'}); return await r.json(); }catch(_){ return []; } }

  async function init(){
    const el = document.getElementById('slbMap'); if(!el) return;
    map = L.map(el).setView([52.5208,13.4095], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);
    clusters = L.markerClusterGroup(); map.addLayer(clusters);

    raw.services = (await loadJSON('data/services.json'))
      .filter(x=>x.lat&&x.lng).map(x=>({
        type:'service', lat:+x.lat, lng:+x.lng,
        title:x.name||'Service', desc:`${x.category||''} · ${x.region||''}`, link:x.website||'#',
        category:x.category||'', region:x.region||''
      }));
    raw.projects = (await loadJSON('data/projects.json'))
      .filter(x=>x.lat&&x.lng).map(x=>({
        type:'project', lat:+x.lat, lng:+x.lng,
        title:x.title||'Projekt', desc:x.status||'', link:x.link||'#',
        category:'', region:''
      }));
    raw.events = (await loadJSON('data/events.json'))
      .filter(x=>x.lat&&x.lng).map(x=>({
        type:'event', lat:+x.lat, lng:+x.lng,
        title:x.title||'Event', desc:x.date||'', link:x.link||'#',
        category:'', region:''
      }));

    // UI
    const cbS = document.getElementById('fServices');
    const cbP = document.getElementById('fProjects');
    const cbE = document.getElementById('fEvents');
    const q   = document.getElementById('mapSearch');
    const ex  = document.getElementById('btnExportCSV');

    function render(){
      clusters.clearLayers();
      visible.length = 0;
      const enabled = {
        service: cbS?.checked !== false,
        project: cbP?.checked !== false,
        event:   cbE?.checked !== false
      };
      const query = q?.value || '';
      const all = [...raw.services, ...raw.projects, ...raw.events]
        .filter(r => enabled[r.type])
        .filter(r => matchesSearch(r, query));

      all.forEach(d=>{
        const marker = L.marker([d.lat,d.lng]);
        marker.bindPopup(`<strong>${d.title}</strong><div>${d.desc||''}</div>${d.link?`<div><a target="_blank" href="${d.link}">Mehr</a></div>`:''}`);
        clusters.addLayer(marker);
      });
      visible.push(...all);
      if(all.length){ map.fitBounds(clusters.getBounds(), {maxZoom:14, padding:[30,30]}); }
    }

    ['input','change'].forEach(ev=>{
      cbS?.addEventListener(ev, render);
      cbP?.addEventListener(ev, render);
      cbE?.addEventListener(ev, render);
      q?.addEventListener(ev,  render);
    });
    ex?.addEventListener('click', ()=> downloadCSV('karte_sichtbar.csv', toCSV(visible)));

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
