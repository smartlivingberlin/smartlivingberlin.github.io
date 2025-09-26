document.addEventListener('DOMContentLoaded', ()=>{
  const ctx=document.getElementById('demoChart');
  if(!ctx) return;
  new Chart(ctx,{
    type:'bar',
    data:{
      labels:['Jan','Feb','Mär','Apr'],
      datasets:[{label:'Demo-Werte',data:[12,19,7,15],backgroundColor:'rgba(54,162,235,0.5)'}]
    }
  });
});
