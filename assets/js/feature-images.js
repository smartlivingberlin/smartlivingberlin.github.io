(function(){
  const MAP = {
    "Immobilien Wissen":"assets/images/hero.jpg",
    "Finanzen":"assets/images/interior1.jpg",
    "Recht":"https://source.unsplash.com/600x400/?law,justice",
    "Smart Living":"https://source.unsplash.com/600x400/?smart,home",
    "Design":"https://source.unsplash.com/600x400/?interior,design",
    "Homestaging":"https://source.unsplash.com/600x400/?homestaging",
    "Berlin":"https://source.unsplash.com/600x400/?berlin,architecture",
    "Lifestyle":"assets/images/living1.jpg"
  };

  // sanfter Tilt nur auf großen Screens
  const enableTilt = () => window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  function preload(url, onOK, onFail){
    const img = new Image();
    img.onload = ()=>onOK(url);
    img.onerror = ()=>onFail();
    img.src = url;
  }

  function decorateCard(card){
    const h = card.querySelector('h5,h4,h3'); if(!h) return;
    const title = (h.textContent||'').trim();
    const key = Object.keys(MAP).find(k => title.includes(k));
    const guess = key ? MAP[key] : `https://source.unsplash.com/600x400/?${encodeURIComponent(title)}`;
    const fallbackCSS = 'linear-gradient(135deg,#0a2540,#143b6a)';

    const applyBG = (urlOrCss, isCss=false)=>{
      card.style.position = 'relative';
      card.style.minHeight = '200px';
      card.style.background = isCss ? urlOrCss : `url("${urlOrCss}") center/cover no-repeat`;
      card.style.color = '#fff';
      card.style.boxShadow = '0 10px 20px rgba(0,0,0,.08)';
      card.style.transition = 'transform .25s ease, box-shadow .25s ease';
      let ov = card.querySelector('.img-overlay');
      if(!ov){ ov = document.createElement('div'); ov.className='img-overlay'; card.appendChild(ov); }
      ov.style.position='absolute'; ov.style.inset='0'; ov.style.borderRadius='14px';
      ov.style.background='linear-gradient(180deg, rgba(10,37,64,.15), rgba(10,37,64,.6))';
      h.style.textShadow='0 1px 2px rgba(0,0,0,.55)';
      if(enableTilt()){
        card.addEventListener('mousemove', e=>{
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left)/r.width - .5;
          const y = (e.clientY - r.top)/r.height - .5;
          card.style.transform = `perspective(800px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', ()=>{ card.style.transform='perspective(800px) rotateX(0) rotateY(0) scale(1)'; });
      }
    };

    preload(guess,
      url => applyBG(url,false),
      () => applyBG(fallbackCSS,true)
    );
  }

  function decorate(selector){
    document.querySelectorAll(selector).forEach(decorateCard);
  }

  // nur diese Bereiche bebildern
  decorate('#themes .card');
  decorate('#featureGrid .card');
})();
