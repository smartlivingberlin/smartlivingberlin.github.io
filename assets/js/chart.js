document.addEventListener('DOMContentLoaded', ()=>{
  const ctx = document.getElementById('demoChart');
  if(!ctx) return;
  const data = {
    labels: ['Demo Solar', 'Tiny House'],
    datasets: [{
      label: 'Finanzierungsstand',
      data: [8000, 34000],
      backgroundColor: ['#28a745','#007bff']
    }]
  };
  new Chart(ctx, {type:'bar', data});
});
