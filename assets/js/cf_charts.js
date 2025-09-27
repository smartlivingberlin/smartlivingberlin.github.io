(async function(){
  if(typeof Chart==='undefined') return;
  let items=[];
  try{ items = await fetch('data/crowdfunding.json',{cache:'no-store'}).then(r=>r.json()); }
  catch(e){ items=[]; }
  if(!Array.isArray(items) || !items.length){
    items=[{title:'Demo Solar',status:'Offen',current:8000,goal:50000,date:'2025-09-20'},
           {title:'Dachsanierung',status:'In Prüfung',current:0,goal:40000,date:'2025-09-18'},
           {title:'Quartier E-Ladesäulen',status:'Finanziert',current:40000,goal:40000,date:'2025-08-30'}];
  }

  // Chart 1: nach Status
  const byStatus = {};
  items.forEach(x=>{ byStatus[x.status]=1+(byStatus[x.status]||0); });
  new Chart(document.getElementById('cfByStatus'),{
    type:'doughnut',
    data:{labels:Object.keys(byStatus),datasets:[{data:Object.values(byStatus)}]},
    options:{plugins:{legend:{position:'bottom'}}}
  });

  // Chart 2: Timeline (Summe "current")
  const byDate = {};
  items.forEach(x=>{
    const d=(x.date||'').slice(0,10);
    byDate[d]=(byDate[d]||0)+(x.current||0);
  });
  const labels=Object.keys(byDate).sort();
  const data=labels.map(k=>byDate[k]);
  new Chart(document.getElementById('cfTimeline'),{
    type:'line',
    data:{labels,datasets:[{label:'eingesammelt (€)',data,tension:.25}]},
    options:{plugins:{legend:{display:false}}}
  });
})();
