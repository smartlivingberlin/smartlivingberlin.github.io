(function(){
  // --- Wetterbereich (deutsches Widget) ans Seitenende anfügen ---
  if(!document.getElementById('wetter')){
    const sec=document.createElement('section');
    sec.id='wetter'; sec.className='section bg-white';
    sec.innerHTML = '<div class="container"><h2 class="mb-3">Wetter – Berlin & Umgebung</h2><div class="ratio ratio-16x9"><iframe title="Wetter" src="https://embed.windy.com/embed2.html?lat=52.52&lon=13.40&zoom=6&level=surface&overlay=wind&metricWind=km%2Fh&metricTemp=%C2%B0C&lang=de" frameborder="0"></iframe></div><p class="small text-muted mt-2">Quelle: windy.com (DE)</p></div>';
    (document.querySelector('main')||document.body).appendChild(sec);
  }

  // --- Homestaging Slider zuverlässiger machen ---
  const range = document.querySelector('.figure-compare input[type=range]');
  const clip  = document.getElementById('afterClip') || document.getElementById('clipM');
  if(range && clip){
    range.addEventListener('input', e => { clip.style.width = e.target.value + '%'; });
  }

  // --- Grundriss: "Beispiel-Plan laden" Button neben Datei-Upload ---
  const cvs = document.getElementById('plannerCanvas');
  if(cvs){
    const upload = cvs.closest('.card')?.querySelector('input[type=file]');
    const btn = document.createElement('button');
    btn.className='btn btn-sm btn-outline-secondary mt-2';
    btn.textContent='Beispiel-Plan laden';
    btn.onclick = ()=> window.loadPlanFrom && window.loadPlanFrom('assets/img/plans/muster-plan-1.png');
    if(upload){ upload.insertAdjacentElement('afterend', btn); }
  }
})();
