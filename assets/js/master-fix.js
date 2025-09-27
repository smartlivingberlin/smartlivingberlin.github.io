window.openByTitle = function(title){
  try{
    const t = (title||'').toLowerCase();
    if(!window.FEATURES){ return alert('Kein FEATURE-Index geladen.'); }
    let i = window.FEATURES.findIndex(f => (f.title||'').toLowerCase() === t);
    if(i < 0) i = window.FEATURES.findIndex(f => (f.title||'').toLowerCase().includes(t));
    if(i >= 0){ window.openFeature(i); } else { alert('Thema nicht gefunden: '+title); }
  }catch(e){ console.error(e); alert('Konnte Thema nicht öffnen.'); }
};
