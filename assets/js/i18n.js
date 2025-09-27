(async function(){
  const cur=localStorage.getItem('lang')||'de';
  async function load(lang){ const r=await fetch(`lang/${lang}.json`,{cache:'no-store'}); return await r.json(); }
  async function apply(lang){
    const tr=await load(lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(tr[k]) el.textContent=tr[k]; });
    localStorage.setItem('lang',lang);
  }
  window.setLang=apply;
  document.addEventListener('DOMContentLoaded',()=>apply(cur));
})();
