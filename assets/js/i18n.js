(async function(){
  const cur = localStorage.getItem('lang') || 'de';
  async function load(lang){
    const r=await fetch(`lang/${lang}.json`,{cache:'no-store'}); return await r.json();
  }
  async function apply(lang){
    const tr=await load(lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n'); if(tr[key]) el.textContent=tr[key];
    });
    localStorage.setItem('lang', lang);
  }
  window.setLang=apply;
  document.addEventListener('DOMContentLoaded',()=>apply(cur));
})();
