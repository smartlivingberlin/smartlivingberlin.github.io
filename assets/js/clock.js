(function(){
  function t(){
    const el=document.getElementById('liveClock');
    if(!el) return;
    const d=new Date();
    el.textContent=d.toLocaleString('de-DE',{dateStyle:'medium', timeStyle:'short'});
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    const nav=document.querySelector('.navbar .container');
    if(!nav) return;
    let span=document.getElementById('liveClock');
    if(!span){
      span=document.createElement('span'); span.id='liveClock';
      span.className='ms-3 text-light small';
      nav.appendChild(span);
    }
    t(); setInterval(t, 60000);
  });
})();
