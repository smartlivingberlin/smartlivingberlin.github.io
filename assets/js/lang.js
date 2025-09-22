(function(){
  const STORE_KEY='slb-lang';
  function getLang(){
    const p=new URLSearchParams(location.search).get('lang');
    const val=(p||localStorage.getItem(STORE_KEY)||'de').toLowerCase();
    localStorage.setItem(STORE_KEY,val);
    return val;
  }
  async function loadDict(){
    try{ const r=await fetch('data/lang.json',{cache:'no-store'}); return r.ok?await r.json():null; }
    catch(e){ return null; }
  }
  function t(dict, lang, key){
    if(dict && dict[lang] && dict[lang][key]) return dict[lang][key];
    if(dict && dict.de && dict.de[key]) return dict.de[key];
    return key;
  }
  async function apply(){
    const lang=getLang(); const dict=await loadDict();
    // alle Elemente mit data-i18n ersetzen
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n');
      el.textContent = t(dict,lang,key);
    });
    // Navbar-Links (falls IDs vergeben)
    const map = {
      '#nav-dashboard':'nav.dashboard','#nav-news':'nav.news','#nav-recht':'nav.recht',
      '#nav-finance':'nav.finance','#nav-smart':'nav.smart','#nav-design':'nav.design','#nav-chat':'nav.chat'
    };
    Object.entries(map).forEach(([sel,key])=>{
      const el=document.querySelector(sel); if(el) el.textContent=t(dict,lang,key);
    });
    // Dokumenttitel optional
    const dt=document.querySelector('title[data-i18n]');
    if(dt){ dt.textContent = t(dict,lang,dt.getAttribute('data-i18n')); }
  }
  // Sprachumschalter Buttons
  function wireSwitcher(){
    document.querySelectorAll('[data-lang-set]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        const lng=btn.getAttribute('data-lang-set');
        localStorage.setItem('slb-lang', lng);
        const url = new URL(location.href);
        url.searchParams.set('lang', lng);
        location.href = url.toString();
      });
    });
  }
  window.addEventListener('DOMContentLoaded', ()=>{ wireSwitcher(); apply(); });
})();
