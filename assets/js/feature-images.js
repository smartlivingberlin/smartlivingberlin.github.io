document.addEventListener('DOMContentLoaded',()=>{
  const cards=document.querySelectorAll('#themes .card');
  const keys=['property','finance','law','smart home','interior','news','berlin','lifestyle'];
  cards.forEach((c,i)=>{
    if(c.querySelector('img')) return;
    const k=keys[i%keys.length];
    const img=new Image();
    img.decoding='async'; img.loading='lazy';
    img.src=`https://source.unsplash.com/400x220/?${encodeURIComponent(k)}`;
    img.alt=k; img.className='img-fluid rounded mb-2';
    c.insertBefore(img,c.firstChild);
  });
});
