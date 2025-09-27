(function(){
  const IMAGES = {
    "Immobilien Wissen":"assets/images/hero.jpg",
    "Finanzen":"assets/images/interior1.jpg",
    "Recht":"assets/images/living1.jpg",
    "Smart-Home Spartipps":"assets/images/kitchen1.jpg",
    "Design & Homestaging":"https://source.unsplash.com/600x400/?interior,design",
    "Smart Living":"https://source.unsplash.com/600x400/?smart,home"
  };
  const cards = document.querySelectorAll('#themes .card');
  cards.forEach(c=>{
    const h = c.querySelector('h5'); if(!h) return;
    const key = Object.keys(IMAGES).find(k=>h.textContent.includes(k));
    const url = key ? IMAGES[key] : `https://source.unsplash.com/600x400/?${encodeURIComponent(h.textContent)}`;
    c.style.backgroundImage = `url("${url}")`;
    c.style.backgroundSize = 'cover';
    c.style.backgroundPosition = 'center';
    c.style.color = '#fff';
    c.style.textShadow = '0 1px 2px rgba(0,0,0,.6)';
    // Overlay
    c.insertAdjacentHTML('afterbegin','<div style="position:absolute;inset:0;border-radius:14px;background:linear-gradient(180deg,rgba(10,37,64,.2),rgba(10,37,64,.55))"></div>');
    c.style.position='relative';
  });
})();
