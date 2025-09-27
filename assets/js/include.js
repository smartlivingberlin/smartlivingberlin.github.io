document.addEventListener('DOMContentLoaded', async ()=>{
  const incs=[...document.querySelectorAll('[data-include]')];
  await Promise.all(incs.map(async el=>{
    try{
      const url = el.getAttribute('data-include');
      const r = await fetch(url,{cache:'no-store'});
      el.innerHTML = r.ok ? await r.text() : `<!-- include failed: ${url} -->`;
    }catch(e){ el.innerHTML=''; }
  }));
});
