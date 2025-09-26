(async function(){
  const el = document.getElementById('cfChart');
  if(!el) return;
  try{
    const r = await fetch('data/crowdfunding.json',{cache:'no-store'});
    const items = await r.json();
    const labels = items.map(x=>x.title||'Projekt');
    const goals  = items.map(x=>+x.goal||0);
    const curr   = items.map(x=>+x.current||0);
    const pct    = curr.map((v,i)=> Math.round(100 * v / (goals[i]||1)));

    new Chart(el,{
      type:'bar',
      data:{
        labels,
        datasets:[
          {label:'Ziel (€)',   data:goals, borderWidth:1},
          {label:'Aktuell (€)',data:curr,  borderWidth:1},
          {label:'% erreicht', data:pct,   type:'line', yAxisID:'y1', tension:.2}
        ]
      },
      options:{
        responsive:true,
        scales:{
          y:{beginAtZero:true, ticks:{callback:v=>v.toLocaleString('de-DE')+' €'}},
          y1:{beginAtZero:true, position:'right', min:0, max:100, ticks:{callback:v=>v+'%'}}
        },
        plugins:{legend:{position:'bottom'}}
      }
    });
  }catch(e){ console.error('Chart load failed', e); }
})();
