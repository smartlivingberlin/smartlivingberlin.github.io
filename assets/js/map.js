(function(){
  let map, clusters, raw = {services:[], projects:[], events:[]}, visible=[], allRows=[];
  let geo = {enabled:false, lat:null, lng:null, km:5, circle:null};

  // === Utils ===
  const norm = s => (s??'').toString().toLowerCase();
  const matchesSearch = (item,q) => !q || [item.title,item.desc,item.category,item.region].some(v=>norm(v).includes(norm(q)));
  const haversineKm = (a,b)=>{
    const R=6371, toRad=x=>x*Math.PI/180;
    const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
    const s1=Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(s1));
  };
  const csvEscape = v => `"${(v??'').toString().replace(/"/g,'""')}"`;
  const toCSV = rows => {
    const head=['type','title','desc','category','region','lat','lng','link'];
    const body=rows.map(r=>[r.type,r.title,r.desc,r.category,r.region,r.lat,r.lng,r.link].map(csvEscape).join(','));
    return [head.join(','),...body].join('\n');
  };
  const downloadCSV = (name,text)=>{
    const blob=new Blob([text],{type:'text/csv;charset=utf-8;'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove();
  };

  async function loadJSON(url){ try{ const r=await fetch(url,{cache:'no-store'}); return await r.json(); }catch{ return []; } }

  function collectCategories(){
    const uniq = arr => [...new Set(arr.filter(Boolean).map(x=>x.trim()))].sort((a,b)=>a.localeCompare(b,'de'));
    return {
      service: uniq(raw.services.map(x=>x.category)),
      project: uniq(raw.projects.map(x=>x.category)),
      event:   uniq(raw.events.map(x=>x.category))
    };
  }

  function populateSelect(sel, values){
    if(!sel) return; const cur = sel.value;
    sel.innerHTML = '<option value="">Alle</option>' + values.map(v=>`<option>${v}</option>`).join('');
    if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
  }

  function applyRadiusFilter(row){
    if(!geo.enabled || geo.lat==null || geo.lng==null) return true;
    const d = haversineKm({lat:geo.lat,lng:geo.lng},{lat:row.lat,lng:row.lng});
    return d <= (geo.km||5);
  }

  function makeMarker(d){
    const marker = L.marker([d.lat,d.lng]);
    marker.bindPopup(`<strong>${d.title}</strong><div>${d.desc||''}</div>${d.link?`<div><a target="_blank" href="${d.link}">Mehr</a></div>`:''}`);
    return marker;
  }

  function render(){
    const cbS = document.getElementById('fServices');
    const cbP = document.getElementById('fProjects');
    const cbE = document.getElementById('fEvents');
    const q   = document.getElementById('mapSearch');
    const sS  = document.getElementById('selCatService');
    const sP  = document.getElementById('selCatProject');
    const sE  = document.getElementById('selCatEvent');

    const enabled = {
      service: cbS?.checked !== false,
      project: cbP?.checked !== false,
      event:   cbE?.checked !== false
    };

    clusters.clearLayers();
    visible.length = 0;

    const selCat = {
      service: sS?.value || '',
      project: sP?.value || '',
      event:   sE?.value || ''
    };

    const qval = q?.value || '';

    const filtered = [...raw.services, ...raw.projects, ...raw.events]
      .filter(r => enabled[r.type])
      .filter(r => !selCat[r.type] || norm(r.category) === norm(selCat[r.type]))
      .filter(r => matchesSearch(r, qval))
      .filter(r => applyRadiusFilter(r));

    filtered.forEach(d=> clusters.addLayer(makeMarker(d)));
    visible.push(...filtered);

    if(filtered.length){
      try{ map.fitBounds(clusters.getBounds(), {maxZoom:14, padding:[30,30]}); }catch{}
    }
  }

  async function init(){
    // Map + Cluster mit Optionen
    map = L.map('slbMap').setView([52.5208,13.4095], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);
    clusters = L.markerClusterGroup({
      maxClusterRadius: 60,             // Clustergröße (Pixel)
      disableClusteringAtZoom: 15,      // ab Zoom 15 keine Cluster
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false
    });
    map.addLayer(clusters);

    // Daten laden
    const S = (await loadJSON('data/services.json')).filter(x=>x.lat&&x.lng).map(x=>({
      type:'service', lat:+x.lat, lng:+x.lng,
      title:x.name||'Service', desc:`${x.category||''}${x.region?` · ${x.region}`:''}`,
      link:x.website||'#', category:x.category||'', region:x.region||''
    }));
    const P = (await loadJSON('data/projects.json')).filter(x=>x.lat&&x.lng).map(x=>({
      type:'project', lat:+x.lat, lng:+x.lng,
      title:x.title||'Projekt', desc:x.status||'',
      link:x.link||'#', category:x.category||'', region:x.region||''
    }));
    const E = (await loadJSON('data/events.json')).filter(x=>x.lat&&x.lng).map(x=>({
      type:'event', lat:+x.lat, lng:+x.lng,
      title:x.title||'Event', desc:x.date||'',
      link:x.link||'#', category:x.category||'', region:x.region||''
    }));
    raw.services=S; raw.projects=P; raw.events=E;
    allRows = [...S,...P,...E];

    // Dropdowns aus Daten füllen
    const cats = collectCategories();
    populateSelect(document.getElementById('selCatService'), cats.service);
    populateSelect(document.getElementById('selCatProject'), cats.project);
    populateSelect(document.getElementById('selCatEvent'),   cats.event);

    // Events
    ['input','change'].forEach(ev=>{
      document.getElementById('fServices')?.addEventListener(ev, render);
      document.getElementById('fProjects')?.addEventListener(ev, render);
      document.getElementById('fEvents')  ?.addEventListener(ev, render);
      document.getElementById('mapSearch')?.addEventListener(ev, render);
      document.getElementById('selCatService')?.addEventListener(ev, render);
      document.getElementById('selCatProject')?.addEventListener(ev, render);
      document.getElementById('selCatEvent')  ?.addEventListener(ev, render);
      document.getElementById('radiusKm')     ?.addEventListener(ev, ()=>{
        const v = +document.getElementById('radiusKm').value || 5; geo.km=v; if(geo.circle){ geo.circle.setRadius(v*1000); } render();
      });
      document.getElementById('cbRadius')?.addEventListener(ev, ()=>{ geo.enabled = document.getElementById('cbRadius').checked; render(); });
    });

    document.getElementById('btnGeo')?.addEventListener('click', ()=>{
      if(!navigator.geolocation){ alert('Geolocation nicht verfügbar.'); return; }
      navigator.geolocation.getCurrentPosition(pos=>{
        geo.lat=pos.coords.latitude; geo.lng=pos.coords.longitude;
        geo.km=+document.getElementById('radiusKm').value || 5;
        geo.enabled = document.getElementById('cbRadius').checked = true;
        if(geo.circle){ map.removeLayer(geo.circle); }
        geo.circle = L.circle([geo.lat,geo.lng], {radius: geo.km*1000, color:'#28c76f', fillOpacity:0.08}).addTo(map);
        map.setView([geo.lat,geo.lng], 13);
        render();
      }, err=>{ alert('Standort konnte nicht ermittelt werden.'); });
    });

    document.getElementById('btnExportCSV')?.addEventListener('click', ()=> downloadCSV('karte_sichtbar.csv', toCSV(visible)));
    document.getElementById('btnExportAll')?.addEventListener('click', ()=> downloadCSV('karte_alle.csv',     toCSV(allRows)));

    // initial
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
