(function(){
  const cId='plannerCanvas';
  function savePNG(){
    const c=document.getElementById(cId); if(!c) return;
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='grundriss-skizze.png'; a.click();
  }
  window.addEventListener('DOMContentLoaded', ()=>{
    const c=document.getElementById(cId); if(!c) return;
    const holder=c.parentNode; const bar=document.createElement('div');
    bar.className='mt-2 d-flex gap-2 flex-wrap';
    bar.innerHTML=`<button class="btn btn-sm btn-secondary" onclick="addBlock()">+ Block</button>
    <button class="btn btn-sm btn-outline-danger" onclick="clearBlocks()">Canvas leeren</button>
    <button class="btn btn-sm btn-outline-primary" id="btnSavePng">PNG exportieren</button>`;
    holder.appendChild(bar);
    document.getElementById('btnSavePng').onclick=savePNG;
  });
})();
