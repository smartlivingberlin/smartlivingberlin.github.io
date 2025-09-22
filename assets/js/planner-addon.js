(function(){
  const cId='plannerCanvas';
  function savePNG(){ const c=document.getElementById(cId); if(!c)return;
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='grundriss.png'; a.click();}
  window.addEventListener('DOMContentLoaded',()=>{
    const holder=document.getElementById(cId)?.parentNode; if(!holder)return;
    const bar=document.createElement('div'); bar.className='mt-2 d-flex gap-2 flex-wrap';
    bar.innerHTML=`<button class="btn btn-sm btn-secondary" onclick="addBlock()">+ Block</button>
    <button class="btn btn-sm btn-outline-danger" onclick="clearBlocks()">Leeren</button>
    <button class="btn btn-sm btn-outline-primary" onclick="(${savePNG})()">PNG speichern</button>`;
    holder.appendChild(bar);
  });
})();
