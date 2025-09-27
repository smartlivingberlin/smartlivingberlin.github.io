(function(){
  // Mapping: Wenn Titel Teile davon enthält, nimm dieses Bild (sonst Unsplash-Fallback)
  const MAP = {
    "Immobilien Wissen":"assets/images/hero.jpg",
    "Finanzen":"assets/images/interior1.jpg",
    "Recht":"https://source.unsplash.com/600x400/?law,justice",
    "Smart Living":"https://source.unsplash.com/600x400/?smart,home",
    "Design":"assets/images/staging.jpg",
    "News":"https://source.unsplash.com/600x400/?news,trend",
    "Berlin":"https://source.unsplash.com/600x400/?berlin,architecture",
    "Lifestyle":"assets/images/living1.jpg"
  };

  const cards = document.querySelectorAll('#themes .card');
  cards.forEach(card=>{
    const h = card.querySelector('h5'); if(!h) return;
    const title = (h.textContent||'').trim();
    const key = Object.keys(MAP).find(k=>title.includes(k));
    const url = key ? MAP[key] : `https://source.unsplash.com/600x400/?${encodeURIComponent(title)}`;

    // Hintergrund + Overlay + Textlesbarkeit
    card.style.position = 'relative';
    card.style.minHeight = '200px';
    card.style.backgroundImage = `url("${url}")`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    card.style.color = '#fff';
    card.style.textShadow = '0 1px 2px rgba(0,0,0,.55)';
    if(!card.querySelector('.img-overlay')){
      const ov = document.createElement('div');
      ov.className='img-overlay';
      ov.style.position='absolute';
      ov.style.inset='0';
      ov.style.borderRadius='14px';
      ov.style.background='linear-gradient(180deg, rgba(10,37,64,.15), rgba(10,37,64,.6))';
      ov.style.pointerEvents='none';
      card.prepend(ov);
    }
    // Inhalte über das Overlay heben
    [...card.children].forEach(ch=>{
      if(ch.classList.contains('img-overlay')) return;
      ch.style.position='relative'; ch.style.zIndex=1;
    });

    // Sanfter 3D-Tilt (ohne externe Lib)
    card.style.transition='transform .18s ease';
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform='none'; });
  });
})();
