(function(){
  function getLang(){
    const p=new URLSearchParams(location.search).get('lang');
    return (p||localStorage.getItem('slb-lang')||'de').toLowerCase();
  }
  function keyFromTitle(title){
    // Titel -> ungefährer i18n-key; fallback: keine Änderung
    const map = {
      "Immobilienpreise 2025":"feature.immobilienpreise",
      "Fördermittel-Finder":"feature.foerdermittel",
      "Smart-Home Spartipps":"feature.smartspare",
      "Nebenkosten verstehen":"feature.nebenkosten",
      "Mietrecht kompakt":"feature.mietrecht",
      "Mieten vs. Kaufen":"feature.mietenkaufen",
      "Hypotheken-Rechner":"feature.hyporechner",
      "Energie & Sanierung":"feature.energie",
      "WEG – Eigentümerwissen":"feature.weg",
      "Grundsteuer & Betriebskosten":"feature.grundsteuer",
      "Smart Meter Pflicht?":"feature.smartmeter",
      "Interior Budget Tricks":"feature.interiorbudget",
      "Homestaging DIY":"feature.homestaging",
      "Grundriss optimieren":"feature.grundriss",
      "Rendite-Hotspots":"feature.rendite",
      "Finanzierungsirrtümer":"feature.finanzirrtuemer",
      "Modernisierungsfahrplan":"feature.modernisierung",
      "Mietspiegel & Bezirke":"feature.mietspiegel",
      "Versicherungen im Überblick":"feature.versicherungen",
      "Tiny House / Co-Living":"feature.wohnenneu",
      "Architektur-Inspiration":"feature.architektur",
      "Energiepreise verstehen":"feature.energiepreise",
      "Checklisten (PDF)":"feature.checklisten",
      "Glossar: Grundbuch, Erbpacht …":"feature.glossar",
      "Smart Locks & Sicherheit":"feature.locks",
      "Förderung Berlin":"feature.foerderungberlin",
      "Kaufnebenkosten":"feature.nebenkostenrechner",
      "Zinsentwicklung":"feature.zins",
      "FAQ für Mieter":"feature.faqmieter",
      "FAQ für Eigentümer":"feature.faqeigentuemer",
      "Bieterverfahren (Light)":"feature.auktion",
      "Projekt einreichen":"feature.submit",
      "Zwangsversteigerung (ZVG)":"feature.zvg"
    };
    return map[title] || null;
  }
  function apply(dict){
    const lang = getLang();
    const data = dict[lang] || dict.de || {};
    document.querySelectorAll('#featureGrid .card').forEach(card=>{
      const h5 = card.querySelector('h5');
      if(!h5) return;
      const title = h5.textContent.trim();
      const key = keyFromTitle(title);
      if(!key || !data[key]) return;
      const img = data[key].img;
      const tag = data[key].tag;

      // Bild oben einfügen (wenn noch keins da)
      if(img && !card.querySelector('img[data-teaser]')){
        const pic = document.createElement('img');
        pic.src = img;
        pic.alt = title;
        pic.loading = 'lazy';
        pic.setAttribute('data-teaser','');
        pic.className = 'img-fluid rounded mb-2';
        h5.parentNode.insertBefore(pic, h5);
      }
      // Tagline ersetzen oder ergänzen
      const p = card.querySelector('p.small-muted');
      if(p && tag){ p.textContent = tag; }
    });
  }
  function boot(){
    fetch('data/teasers.json',{cache:'no-store'})
      .then(r=>r.json())
      .then(apply)
      .catch(()=>{});
  }
  window.addEventListener('DOMContentLoaded', ()=> setTimeout(boot, 250));
})();
