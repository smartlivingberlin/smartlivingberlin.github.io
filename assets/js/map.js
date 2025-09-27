(async function(){
  if(typeof L==='undefined') return;
  const map=L.map('slbMap').setView([52.5200,13.4050], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OSM'}).addTo(map);

  const data = await fetch('data/listings.json',{cache:'no-store'}).then(r=>r.json()).catch(()=>[]);
  const markers = L.markerClusterGroup();
  const allCats = new Set();

  const toLatLng = x => (x && x.lat && x.lng) ? [x.lat,x.lng] : null;

  data.forEach(item=>{
    if(item.category) allCats.add(item.category);
    const ll = toLatLng(item.location_latlng || item.latlng);
    if(!ll) return;
    const m=L.marker(ll).bindPopup(`
      <strong>${item.title||''}</strong><br>
      <small>${item.location||''}</small><br>
      <span class="badge bg-light text-dark">${item.category||''}</span><br>
      ${item.price?('<div class="mt-1">'+item.price+'</div>'):''}
    `);
    m.options._meta=item;
    markers.addLayer(m);
  });
  map.addLayer(markers);

  // Kategorien füllen
  const sel=document.getElementById('mapCategory');
  [...allCats].sort().forEach(c=>{
    const o=document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o);
  });

  // Umkreissuche (Geolocation)
  let circle=null, userLL=null;
  async function setRadiusKm(km){
    if(circle){ map.removeLayer(circle); circle=null; }
    if(!km){ markers.refreshClusters(); return; }
    if(!userLL){
      await new Promise(res=>{
        navigator.geolocation?.getCurrentPosition(p=>{
          userLL=[p.coords.latitude,p.coords.longitude]; res();
        },()=>res(),{enableHighAccuracy:true,timeout:5000});
      });
    }
    if(!userLL) return;
    circle=L.circle(userLL,{radius:km*1000, color:'#28c76f'}).addTo(map);
    map.setView(userLL, 12);
  }

  // Filter
  function applyFilter(){
    const q=(document.getElementById('mapSearch').value||'').toLowerCase();
    const cat=(document.getElementById('mapCategory').value||'').toLowerCase();
    const km=+document.getElementById('mapRadius').value||0;

    const llRef = (circle && userLL) ? userLL : null;

    markers.clearLayers();
    data.forEach(item=>{
      const ll = toLatLng(item.location_latlng || item.latlng);
      if(!ll) return;
      const txt=[item.title,item.location,item.category].join(' ').toLowerCase();
      if(q && !txt.includes(q)) return;
      if(cat && (item.category||'').toLowerCase()!==cat) return;
      if(km && llRef){
        const d = map.distance(llRef, ll)/1000.0;
        if(d>km) return;
      }
      const m=L.marker(ll).bindPopup(`<strong>${item.title||''}</strong><br><small>${item.location||''}</small><br><span class="badge bg-light text-dark">${item.category||''}</span>`);
      m.options._meta=item;
      markers.addLayer(m);
    });
  }
  document.getElementById('mapSearch').addEventListener('input',applyFilter);
  document.getElementById('mapCategory').addEventListener('change',applyFilter);
  document.getElementById('mapRadius').addEventListener('change',e=>{
    setRadiusKm(+e.target.value||0).then(applyFilter);
  });

  // CSV Export (alle Marker, nicht nur sichtbare)
  document.getElementById('csvExport').addEventListener('click',()=>{
    const rows=[['title','location','category','price','lat','lng']];
    data.forEach(x=>{
      const ll = toLatLng(x.location_latlng || x.latlng) || [ '', '' ];
      rows.push([
        (x.title||'').replace(/,/g,' '),
        (x.location||'').replace(/,/g,' '),
        (x.category||'').replace(/,/g,' '),
        (x.price||'').replace(/,/g,' '),
        ll[0], ll[1]
      ]);
    });
    const csv=rows.map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download='listings.csv'; a.click();
  });
})();
