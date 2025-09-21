(function(){
  function getLang(){
    const p=new URLSearchParams(location.search).get('lang');
    return (p||localStorage.getItem('slb-lang')||'de').toLowerCase();
  }
  function setLang(l){ localStorage.setItem('slb-lang', l); }

  function slug(){
    const s=(location.pathname.split('/').pop()||'').replace('.html','');
    return s||'index';
  }

  function t(dict, key){
    const l=getLang(); 
    return (dict[l] && dict[l][key]) || (dict.de && dict.de[key]) || '';
  }

  function apply(dict){
    const s = slug();
    const base = 'themen.'+s;
    const H1   = document.querySelector('h1#title, body h1');
    const LEAD = document.querySelector('p#lead, p.lead');
    const S1H  = document.querySelector('[data-i18n="sec1.h"]') || document.querySelector('h4:nth-of-type(1)');
    const S1P  = document.querySelector('[data-i18n="sec1.p"]') || document.querySelector('h4:nth-of-type(1) + p');
    const S2H  = document.querySelector('[data-i18n="sec2.h"]') || document.querySelector('h4:nth-of-type(2)');
    const S2P  = document.querySelector('[data-i18n="sec2.p"]') || document.querySelector('h4:nth-of-type(2) + p');
    const S3H  = document.querySelector('[data-i18n="sec3.h"]') || document.querySelector('h4:nth-of-type(3)');
    const S3P  = document.querySelector('[data-i18n="sec3.p"]') || document.querySelector('h4:nth-of-type(3) + p');

    if(H1)   H1.textContent   = t(dict, base+'.title') || H1.textContent;
    if(LEAD) LEAD.textContent = t(dict, base+'.lead')  || LEAD.textContent;
    if(S1H)  S1H.textContent  = t(dict, base+'.sec1.h')|| S1H.textContent;
    if(S1P)  S1P.textContent  = t(dict, base+'.sec1.p')|| S1P.textContent;
    if(S2H)  S2H.textContent  = t(dict, base+'.sec2.h')|| S2H.textContent;
    if(S2P)  S2P.textContent  = t(dict, base+'.sec2.p')|| S2P.textContent;
    if(S3H)  S3H.textContent  = t(dict, base+'.sec3.h')|| S3H.textContent;
    if(S3P)  S3P.textContent  = t(dict, base+'.sec3.p')|| S3P.textContent;

    // Sidebar/Buttons (falls vorhanden)
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = t(dict, key);
      if(val) el.textContent = val;
    });
  }

  function boot(){
    fetch('../data/lang.json',{cache:'no-store'})
      .then(r=>r.json())
      .then(dict=>apply(dict))
      .catch(()=>{});
  }

  // Sprache aus URL merken (optional)
  const urlLang=new URLSearchParams(location.search).get('lang');
  if(urlLang){ setLang(urlLang.toLowerCase()); }

  window.addEventListener('DOMContentLoaded', boot);
})();
