document.addEventListener('DOMContentLoaded',async ()=>{
  const nodes=[...document.querySelectorAll('[data-include]')];
  await Promise.all(nodes.map(async el=>{
    try{
      const url=el.getAttribute('data-include');
      const r=await fetch(url,{cache:'no-store'});
      if(r.ok){ el.innerHTML=await r.text(); }
    }catch(e){ console.warn('Include failed',e); }
  }));
});
