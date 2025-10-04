(function(){
  async function ensureChartJS(){
    if(window.Chart) return;
    await new Promise((ok,err)=>{ const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/chart.js'; s.onload=ok; s.onerror=err; document.head.appendChild(s);});
  }
  async function fetchJSON(u){ try{const r=await fetch(u,{cache:'no-store'}); if(!r.ok) throw 0; return r.json();}catch(_){return null;} }
  async function drawDemoChart(id='zinsChart'){
    const el=document.getElementById(id); if(!el) return;
    await ensureChartJS();
    let s=(await fetchJSON('data/charts.json'))?.zins;
    if(!s) s={labels:["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],data:[2.1,2.4,2.8,3.2,3.5,3.7,3.9,4.0,3.7,3.5,3.4,3.3]};
    new Chart(el,{type:'line',data:{labels:s.labels,datasets:[{label:'Zins p. a. (%)',data:s.data,tension:.25}]},
      options:{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>v+'%'}}}}});
  }
  addEventListener('DOMContentLoaded',()=>drawDemoChart());
})();
