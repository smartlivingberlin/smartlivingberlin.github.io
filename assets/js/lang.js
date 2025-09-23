(function(){
  const STORE_KEY='slb-lang';
  function getLang(){
    const p=new URLSearchParams(location.search).get('lang');
    const val=(p||localStorage.getItem(STORE_KEY)||'de').toLowerCase();
    localStorage.setItem(STORE_KEY,val);
    return val;
  }
  async function loadDict(){
    try{ const r=await fetch('data/lang.json',{cache:'no-store'}); return r.ok?await r.json():null; }catch(e){ return null; }
  }
  function t(dict, lang, key){
    if(dict && dict[lang] && dict[lang][key]) return dict[lang][key];
    if(dict && dict.de && dict.de[key]) return dict.de[key];
    return key;
  }
  async function apply(){
    const lang=getLang(); const dict=await loadDict();
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n'); el.textContent=t(dict,lang,key);
    });
  }
  function wireSwitcher(){
    document.querySelectorAll('[data-lang-set]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        e.preventDefault();
        const lng=btn.getAttribute('data-lang-set');
        localStorage.setItem('slb-lang', lng);
        const url=new URL(location.href); url.searchParams.set('lang',lng); location.href=url.toString();
      });
    });
  }
  window.addEventListener('DOMContentLoaded', ()=>{ wireSwitcher(); apply(); });
})();
