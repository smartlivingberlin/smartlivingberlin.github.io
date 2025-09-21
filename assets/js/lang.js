(function(){
  const STORE_KEY = 'slb-lang';
  const paramLang = new URLSearchParams(location.search).get('lang');
  const saved = localStorage.getItem(STORE_KEY);
  const lang = (paramLang || saved || 'de').toLowerCase();

  // Sprache merken (wenn per URL gesetzt)
  if (paramLang) localStorage.setItem(STORE_KEY, lang);

  // JSON laden und anwenden
  fetch('data/lang.json', {cache:'no-store'})
    .then(r=>r.json())
    .then(dict => applyLang(dict, lang))
    .catch(()=>{ /* still ok */ });

  function t(dict, key, lang){
    return (dict[lang] && dict[lang][key]) || (dict['de'] && dict['de'][key]) || '';
  }

  function applyLang(dict, lang){
    // 1) data-i18n (text)
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const txt = t(dict, key, lang);
      if (txt) el.textContent = txt;
    });
    // 2) data-i18n-attr (placeholder/title)
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const txt = t(dict, key, lang);
      if (txt && attr) el.setAttribute(attr, txt);
    });

    // 3) Themenseiten (#title, #lead) anhand des Slug automatisch
    const path = location.pathname.split('/').pop();
    if (path && path.endsWith('.html') && location.pathname.includes('/themen/')){
      const slug = path.replace('.html','')
        .replace('waermepumpe','waermepumpe')      // bleibt gleich, nur Beispiel
        .replace('eeg-kompakt','eeg');             // Mapper für kürzere Keys
      const titleKey = `themen.${slug}.title`;
      const leadKey  = `themen.${slug}.lead`;
      const h = document.getElementById('title');
      const p = document.getElementById('lead');
      if (h) h.textContent = t(dict, titleKey, lang) || h.textContent;
      if (p) p.textContent = t(dict, leadKey, lang)  || p.textContent;
      document.title = h ? h.textContent : document.title;
    }

    // 4) Sprach-Schalter aktiv markieren
    document.querySelectorAll('.slb-lang a').forEach(a=>{
      const l = (new URLSearchParams(a.search).get('lang')||'de').toLowerCase();
      a.classList.toggle('active', l===lang);
    });
  }

  // Kleiner, unaufdringlicher Sprachnavigator (falls noch nicht vorhanden)
  document.addEventListener('DOMContentLoaded', ()=>{
    if (!document.querySelector('.slb-lang')){
      const div = document.createElement('div');
      div.className = 'slb-lang';
      div.innerHTML = '<a href="?lang=de">DE</a><a href="?lang=en">EN</a><a href="?lang=ru">RU</a>';
      Object.assign(div.style, {
        position:'fixed', right:'12px', top:'10px', zIndex: 9999,
        background:'#fff', border:'1px solid #e5e7eb', borderRadius:'20px',
        padding:'4px 8px', fontSize:'12px', boxShadow:'0 2px 8px rgba(0,0,0,.06)'
      });
      div.querySelectorAll('a').forEach(a=>{
        a.style.margin='0 6px'; a.style.textDecoration='none'; a.style.color='#0a2540';
      });
      document.body.appendChild(div);
      // kleine CSS-Regel für active
      const s=document.createElement('style'); s.textContent='.slb-lang a.active{font-weight:700;text-decoration:underline;}';
      document.head.appendChild(s);
    }
  });
})();
