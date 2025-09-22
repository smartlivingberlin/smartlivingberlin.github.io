(function(){
  const cId='plannerCanvas';
  function savePNG(){
    const c=document.getElementById(cId); if(!c) return;
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='grundriss-skizze.png'; a.click();
  }
  window.addEventListener('DOMContentLoaded', ()=>{
    const holder=document.getElementById(cId)?.parentNode;
    if(holder){
      const bar=document.createElement('div');
      bar.className='mt-2 d-flex gap-2 flex-wrap';
      bar.innerHTML = `
        <button class="btn btn-sm btn-secondary" onclick="addBlock()">+ Block</button>
        <button class="btn btn-sm btn-outline-danger" onclick="clearBlocks()">Canvas leeren</button>
        <button class="btn btn-sm btn-outline-primary" id="btnSavePng">PNG exportieren</button>
        <button class="btn btn-sm btn-outline-secondary" id="btnDemo1">Demo-Plan laden</button>
        <span class="small text-muted">Tasten: Pfeile bewegen, [Entf] löschen</span>`;
      holder.appendChild(bar);
      document.getElementById('btnSavePng').onclick=savePNG;
      document.getElementById('btnDemo1').onclick=()=>{
        fetch('assets/img/plans/demo1.json').then(r=>r.json()).then(list=>{
          window.blocks = list; if(window.drawPlan) window.drawPlan();
        });
      };
      window.addEventListener('keydown', (e)=>{
        if(!window.blocks||!window.blocks.length) return;
        const b=window.blocks[window.blocks.length-1];
        const step = e.shiftKey?10:2;
        if(e.key==='ArrowLeft'){ b.x=Math.max(0,b.x-step); }
        if(e.key==='ArrowRight'){ b.x=b.x+step; }
        if(e.key==='ArrowUp'){ b.y=Math.max(0,b.y-step); }
        if(e.key==='ArrowDown'){ b.y=b.y+step; }
        if(e.key==='Delete' || e.key==='Backspace'){ window.blocks.pop(); }
        if(window.drawPlan) window.drawPlan();
      });
    }
  });
})();
