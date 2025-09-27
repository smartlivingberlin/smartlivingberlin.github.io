(async function(){
  const lawOut = document.getElementById('lawOut');
  const faqList= document.getElementById('faqList');
  async function get(u){ try{ const r=await fetch(u,{cache:'no-store'}); return r.ok? await r.json():null; }catch{return null;} }
  const LAW = await get('data/law.json') || [];
  const FAQ = await get('data/faq.json') || [];
  // FAQ render
  if(faqList){
    faqList.innerHTML = FAQ.map(f=>`<details class="mb-2"><summary><strong>${f.q}</strong></summary><p class="mb-1">${f.a}</p></details>`).join('') || '<div class="small text-muted">Keine FAQ.</div>';
  }
  // Explain
  document.getElementById('btnExplain')?.addEventListener('click', ()=>{
    const key=(document.getElementById('lawInput')?.value||'').trim();
    const hit = LAW.find(x=> (x.paragraph||'').toLowerCase() === key.toLowerCase());
    const txt = hit ? hit.explanation : "Keine Kurz-Erklärung lokal vorhanden. Pflege <code>data/law.json</code>.";
    if(lawOut){ lawOut.innerHTML = `<div class="alert alert-light border"><strong>${key||"–"}</strong><div class="mt-2">${txt}</div><div class="small text-muted mt-2">*Keine Rechtsberatung.*</div></div>`; }
  });
})();
