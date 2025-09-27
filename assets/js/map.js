(function(){
  let map, clusters, raw={services:[],projects:[],events:[]}, visible=[], allRows=[];
  let geo={enabled:false,lat:null,lng:null,km:5,circle:null};

  const norm=s=>(s??'').toString().toLowerCase();
  const match=(it,q)=>!q||[it.title,it.desc,it.category,it.region].some(v=>norm(v).includes(norm(q)));
  const hav=(a,b)=>{const R=6371,t=x=>x*Math.PI/180;const dLat=t(b.lat-a.lat),dLng=t(b.lng-a.lng);const s1=Math.sin(dLat/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(s1));}
  const csv=(rows)=>['type,title,desc,category,region,lat,lng,link', ...rows.map(r=>['type','title','desc','category','region','lat','lng','link'].map(k=>`"${(r[k]??'').toString().replace(/"/g,'""')}"`).join(','))].join('\n');
  const dl=(name,text)=>{const b=new Blob([text],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); a.remove();};
  async function get(u){try{const r=await fetch(u,{cache:'no-store'}); return r.ok? await r.json():[];}catch{return [];}}
  function cats(){const u=a=>[...new Set(a.filter(Boolean).map(x=>x.trim()))].sort((a,b)=>a.localeCompare(b,'de')); return {service:u(raw.services.map(x=>x.category)),project:u(raw.projects.map(x=>x.category)),event:u(raw.events.map(x=>x.category))};}
  function fill(sel,vals){if(!sel)return;const cur=sel.value; sel.innerHTML='<option value=\"\">Alle</option>'+vals.map(v=>`<option>${v}</option>`).join(''); if([...sel.options].some(o=>o.value===cur)) sel.value=cur;}
  function inRadius(r){ if(!geo.enabled||geo.lat==null) return true; return hav({lat:geo.lat,lng:geo.lng},{lat:r.lat,lng:r.lng}) <= (geo.km||5); }
  function marker(d){ const m=L.marker([d.lat,d.lng]); m.bindPopup(`<strong>${d.title}</strong><div>${d.desc||''}</div>${d.link?`<div><a target="_blank" href="${d.link}">Mehr</a></div>`:''}`); return m; }
  function render(){
    const cbS=document.getElementById('fServices'),cbP=document.getElementById('fProjects'),cbE=document.getElementById('fEvents');
    const q=document.getElementById('mapSearch');
    const sS=document.getElementById('selCatService'),sP=document.getElementById('selCatProject'),sE=document.getElementById('selCatEvent');
    const on={service:cbS?.checked!==false,project:cbP?.checked!==false,event:cbE?.checked!==false};
    const sel={service:sS?.value||'',project:sP?.value||'',event:sE?.value||''};
    const query=q?.value||'';
    clusters.clearLayers(); visible.length=0;
    const arr=[...raw.services,...raw.projects,...raw.events]
      .filter(r=>on[r.type])
      .filter(r=>!sel[r.type]||norm(r.category)===norm(sel[r.type]))
      .filter(r=>match(r,query))
      .filter(r=>inRadius(r));
    arr.forEach(d=>clusters.addLayer(marker(d))); visible.push(...arr);
    if(arr.length){try{map.fitBounds(clusters.getBounds(),{maxZoom:14,padding:[30,30]});}catch{}}
  }
  async function init(){
    const el=document.getElementById('slbMap'); if(!el) return;
    map=L.map('slbMap').setView([52.5208,13.4095],11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
    clusters=L.markerClusterGroup({maxClusterRadius:60,disableClusteringAtZoom:15,spiderfyOnMaxZoom:true,showCoverageOnHover:false});
    map.addLayer(clusters);
    const S=(await get('data/services.json')).filter(x=>x.lat&&x.lng).map(x=>({type:'service',lat:+x.lat,lng:+x.lng,title:x.name||'Service',desc:`${x.category||''}${x.region?` · ${x.region}`:''}`,link:x.website||'#',category:x.category||'',region:x.region||''}));
    const P=(await get('data/projects.json')).filter(x=>x.lat&&x.lng).map(x=>({type:'project',lat:+x.lat,lng:+x.lng,title:x.title||'Projekt',desc:x.status||'',link:x.link||'#',category:x.category||'',region:x.region||''}));
    const E=(await get('data/events.json')).filter(x=>x.lat&&x.lng).map(x=>({type:'event',lat:+x.lat,lng:+x.lng,title:x.title||'Event',desc:x.date||'',link:x.link||'#',category:x.category||'',region:x.region||''}));
    raw.services=S; raw.projects=P; raw.events=E; allRows=[...S,...P,...E];
    const c=cats(); fill(document.getElementById('selCatService'),c.service); fill(document.getElementById('selCatProject'),c.project); fill(document.getElementById('selCatEvent'),c.event);
    ['input','change'].forEach(ev=>{
      ['fServices','fProjects','fEvents','mapSearch','selCatService','selCatProject','selCatEvent','radiusKm','cbRadius'].forEach(id=>{document.getElementById(id)?.addEventListener(ev,()=>{ if(id==='radiusKm'){ const v=+document.getElementById('radiusKm').value||5; geo.km=v; if(geo.circle){ geo.circle.setRadius(v*1000);} } render();});});
    });
    document.getElementById('btnGeo')?.addEventListener('click',()=>{
      if(!navigator.geolocation){ alert('Geolocation nicht verfügbar.'); return;}
      navigator.geolocation.getCurrentPosition(pos=>{
        geo.lat=pos.coords.latitude; geo.lng=pos.coords.longitude; geo.km=+document.getElementById('radiusKm').value||5;
        geo.enabled=document.getElementById('cbRadius').checked=true;
        if(geo.circle){ map.removeLayer(geo.circle); }
        geo.circle=L.circle([geo.lat,geo.lng],{radius:geo.km*1000,color:'#28c76f',fillOpacity:0.08}).addTo(map);
        map.setView([geo.lat,geo.lng],13); render();
      },()=>alert('Standort konnte nicht ermittelt werden.'));
    });
    document.getElementById('btnExportCSV')?.addEventListener('click',()=>dl('karte_sichtbar.csv',csv(visible)));
    document.getElementById('btnExportAll')?.addEventListener('click',()=>dl('karte_alle.csv',csv(allRows)));
    render();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
