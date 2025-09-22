(function(){
  const fmt = new Intl.DateTimeFormat('de-DE',{
    weekday:'short', day:'2-digit', month:'2-digit', year:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit'
  });
  function tick(){
    const el = document.getElementById('liveClock');
    if(!el) return;
    const now = new Date();
    el.textContent = fmt.format(now);
  }
  window.addEventListener('DOMContentLoaded', ()=>{ tick(); setInterval(tick,1000); });
})();
