(function(){
  const MAP={
    "Immobilien Wissen":"assets/images/hero.jpg",
    "Finanzen":"assets/images/interior1.jpg",
    "Recht":"assets/images/berlin1.jpg",
    "Smart Living":"assets/images/smart1.jpg",
    "Design":"assets/images/design1.jpg",
    "News":"assets/images/news1.jpg",
    "Berlin":"assets/images/berlin2.jpg",
    "Lifestyle":"assets/images/living1.jpg"
  };
  const fallback = t => `https://source.unsplash.com/600x400/?${encodeURIComponent(t)}`;
  const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches;

  function applyCard(card,url){
    card.style.setProperty('--bg-img', `url("${url}")`);
    card.querySelectorAll('.btn').forEach(b=>{
      b.classList.remove('btn-outline-primary'); b.classList.add('btn-light');
    });
    if(fine()){
      card.addEventListener('mousemove', e=>{
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*8;
        const ry=-((e.clientX-r.left)/r.width-.5)*8;
        card.style.transform=`perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', ()=> card.style.transform='perspective(800px) rotateX(0) rotateY(0)');
    }
  }
  function pickURL(title){
    const k=Object.keys(MAP).find(k=>title.toLowerCase().includes(k.toLowerCase()));
    return k?MAP[k]:fallback(title);
  }
  function decorate(){
    document.querySelectorAll('#themes .card').forEach(card=>{
      const t=card.querySelector('h5,.card-title'); if(!t) return;
      const title=(t.textContent||'').trim(); const url=pickURL(title);
      const img=new Image();
      img.onload=()=>applyCard(card,url);
      img.onerror=()=>applyCard(card,fallback('architecture,interior'));
      img.src=url;
    });
  }
  addEventListener('DOMContentLoaded', decorate);
})();
