(async function(){
  const k='slb-lang';
  const current = localStorage.getItem(k) || (navigator.language||'de').slice(0,2);
  async function load(lang){
    try{
      const r=await fetch(`lang/${lang}.json`,{cache:'no-store'});
      if(!r.ok) return;
      const map=await r.json();
      for(const [id,val] of Object.entries(map)){
        const el=document.getElementById(id);
        if(el) el.innerHTML=val;
      }
    }catch(e){}
  }
  function set(lang){ localStorage.setItem(k,lang); load(lang); }
  window.SLB_I18N={set};
  await load(current);
})();
