(function(){
  const elMap = document.getElementById('mapCanvas');
  if(!elMap || !window.L) return;

  const $ = (id)=>document.getElementById(id);
  const elSearch  = $('mapSearch');
  const elCat     = $('mapCategory');
  const elRad     = $('mapRadius');
  const elClu     = $('clusterSize');
  const btnCSV    = $('csvExport');
  const btnLoc    = $('useLocation');
  const btnReset  = $('resetFilters');
  const elCount   = $('mapCount');

  const center = [52.52, 13.405]; // Berlin
  const map = L.map('mapCanvas').setView(center, 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  let state = { all: [], filtered: [], clusterSize: +(elClu?.value||60), radius: +(elRad?.value||0), q:'', cat:'', myPos:null };
  let clusterLayer = null;

  // fetchJSON kommt aus index.html
  (async function init(){
    state.all = await loadData();
    // Kategorien füllen
    const cats = Array.from(new Set(state.all.map(m=>m.category).filter(Boolean))).sort();
    cats.forEach(c=>{ const o = document.createElement('option'); o.value=c; o.textContent=c; elCat.appendChild(o); });
    // Events
    elSearch?.addEventListener('input',e=>{ state.q = e.target.value; rebuild(); });
    elCat?.addEventListener('change',e=>{ state.cat = e.target.value; rebuild(); });
    elRad?.addEventListener('change',e=>{ state.radius = +e.target.value||0; rebuild(); });
    elClu?.addEventListener('input',e=>{ state.clusterSize = +e.target.value||60; rebuild(); });
    btnCSV?.addEventListener('click',()=> exportCSV(state.all));
    btnLoc?.addEventListener('click',useLocation);
    btnReset?.addEventListener('click',()=>{ state.q='';state.cat='';state.radius=0;
      if(elSearch) elSearch.value=''; if(elCat) elCat.value=''; if(elRad) elRad.value='0';
      map.setView(center,11); rebuild();
    });
    rebuild();
  })();

  async function loadData(){
    const listings = await (window.fetchJSON?fetchJSON('data/listings.json'):Promise.resolve(null)) || [];
    const out = [];
    listings.forEach(x=>{
      const lat = +x.lat || +x.latitude, lng = +x.lng || +x.longitude;
      const ll = (isFinite(lat)&&isFinite(lng)) ? {lat,lng} : {lat:center[0]+(Math.random()-0.5)*0.2, lng:center[1]+(Math.random()-0.5)*0.3};
      out.push({
        title: x.title || x.name || 'Eintrag',
        location: x.location || x.address || '',
        category: x.category || x.tag || '',
        price: x.price || '',
        page: x.page || x.url || '',
        ...ll
      });
    });
    // Fallback wenn Datei leer: 15 Demos
    if(!out.length){
      for(let i=0;i<15;i++){
        out.push({title:'Demo-Ort '+(i+1), location:'Berlin', category: i%2?'Projekt':'Angebot',
          price:'', page:'#', lat:center[0]+(Math.random()-0.5)*0.2, lng:center[1]+(Math.random()-0.5)*0.3});
      }
    }
    return out;
  }

  function rebuild(){
    if(clusterLayer) map.removeLayer(clusterLayer);
    clusterLayer = L.markerClusterGroup({ maxClusterRadius: state.clusterSize, spiderfyOnMaxZoom:true, showCoverageOnHover:false });
    const filtered = filterMarkers();
    filtered.forEach(m=>{
      const mk = L.marker([m.lat, m.lng]);
      mk.bindPopup(`<strong>${m.title||'Eintrag'}</strong>
        <div>${m.location||''}</div>
        <div><span class="badge bg-light text-dark">${m.category||''}</span></div>
        ${m.price?`<div class="small-muted">${m.price}</div>`:''}
        ${m.page?`<div class="mt-1"><a href="${m.page}" target="_blank" rel="noopener">Öffnen</a></div>`:''}`);
      clusterLayer.addLayer(mk);
    });
    clusterLayer.addTo(map);
    state.filtered = filtered;
    if(elCount){
      elCount.textContent = `${filtered.length} / ${state.all.length} Treffer` +
        (state.radius?` · ${state.radius} km`:'') + ` · CSV exportiert alle Marker`;
    }
  }

  function filterMarkers(){
    let arr = state.all.slice();
    const q = state.q.trim().toLowerCase();
    if(q) arr = arr.filter(m => [m.title,m.location,m.category].join(' ').toLowerCase().includes(q));
    if(state.cat) arr = arr.filter(m => m.category===state.cat);
    if(state.radius>0 && state.myPos){
      arr = arr.filter(m => haversine(m.lat,m.lng,state.myPos.lat,state.myPos.lng) <= state.radius);
    }
    return arr;
  }

  function useLocation(){
    if(!navigator.geolocation){ alert('Geolocation nicht verfügbar'); return; }
    navigator.geolocation.getCurrentPosition(pos=>{
      state.myPos = {lat:pos.coords.latitude, lng:pos.coords.longitude};
      L.marker([state.myPos.lat,state.myPos.lng],{title:'Mein Standort'}).addTo(map);
      map.setView([state.myPos.lat,state.myPos.lng], 12);
      rebuild();
    }, ()=>alert('Geolocation abgelehnt'));
  }

  function haversine(lat1,lon1,lat2,lon2){
    const R=6371, toRad = d=>d*Math.PI/180;
    const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(a));
  }

  function exportCSV(arr){
    const header = ['title','location','category','price','lat','lng','page'];
    const lines = [header.join(',')].concat(arr.map(m=> header.map(k=> csvEscape(m[k])).join(',')));
    const blob = new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='markers.csv';
    document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 800);
  }
  function csvEscape(v){ if(v==null) return ''; const s=String(v).replace(/"/g,'""'); return `"${s}"`; }
})();
