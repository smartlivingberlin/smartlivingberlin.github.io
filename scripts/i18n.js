(async function(){
  const url=new URL(window.location.href);
  const lang=(url.searchParams.get('lang')||localStorage.getItem('lang')||'de').toLowerCase();
  localStorage.setItem('lang',lang);
  document.documentElement.lang=lang;
  const dd=document.getElementById('langDD'); if(dd) dd.textContent=lang.toUpperCase();
  let dict={};
  try{ dict=await (await fetch(`data/i18n/${lang}.json`,{cache:'no-store'})).json(); }catch(e){}
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n'); if(dict[key]) el.innerHTML=dict[key];
  });
})();
