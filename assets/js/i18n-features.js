(function(){
  const STORE_KEY='slb-lang';
  function getLang(){
    const p=new URLSearchParams(location.search).get('lang');
    return (p||localStorage.getItem(STORE_KEY)||'de').toLowerCase();
  }
  const FEATURES_I18N = [
    {key:"feature.immobilienpreise", desc:"Entwicklung & Prognosen – interaktiv.", link:"#news", type:"chart"},
    {key:"feature.foerdermittel", desc:"KfW/BAFA kurz erklärt.", link:"#recht", type:"faq"},
    {key:"feature.smartspare", desc:"Sinnvolle Geräte & Effekte.", link:"#smart", type:"table"},
    {key:"feature.nebenkosten", desc:"Was ist umlagefähig?", link:"#recht", type:"faq"},
    {key:"feature.mietrecht", desc:"§ 535, § 556 BGB einfach erklärt.", link:"#recht", type:"law"},
    {key:"feature.mietenkaufen", desc:"Vergleich mit Beispielzahlen.", link:"#finanzen", type:"calc"},
    {key:"feature.hyporechner", desc:"Rate, Gesamtzins, Annuität.", link:"#finanzen", type:"calc_ann"},
    {key:"feature.energie", desc:"Was lohnt sich wann?", link:"#smart", type:"gallery"},
    {key:"feature.weg", desc:"Beschlüsse & Verwaltung leicht.", link:"#recht", type:"faq"},
    {key:"feature.grundsteuer", desc:"Kurz & klar.", link:"#recht", type:"faq"},
    {key:"feature.smartmeter", desc:"Was bedeutet das praktisch?", link:"#smart", type:"table"},
    {key:"feature.interiorbudget", desc:"Qualität für wenig Geld.", link:"#design", type:"gallery"},
    {key:"feature.homestaging", desc:"Vorher/Nachher & Checkliste.", link:"#design", type:"slider"},
    {key:"feature.grundriss", desc:"Zonen, Licht, Wege.", link:"#design", type:"planner"},
    {key:"feature.rendite", desc:"Wo lohnt sich Investment?", link:"#news", type:"chart"},
    {key:"feature.finanzirrtuemer", desc:"10 Fehler vermeiden.", link:"#finanzen", type:"calc"},
    {key:"feature.modernisierung", desc:"Schrittweise zur Effizienz.", link:"#smart", type:"gallery"},
    {key:"feature.mietspiegel", desc:"Preisgefühl gewinnen.", link:"#news", type:"list"},
    {key:"feature.versicherungen", desc:"Was ist sinnvoll?", link:"#finanzen", type:"faq"},
    {key:"feature.wohnenneu", desc:"Neue Wohnformen.", link:"#news", type:"list"},
    {key:"feature.architektur", desc:"Galerie & Stile.", link:"#smart", type:"gallery"},
    {key:"feature.energiepreise", desc:"Trends erkennen.", link:"#news", type:"chart"},
    {key:"feature.checklisten", desc:"Kauf, Übergabe, Vermietung.", link:"#recht", type:"faq"},
    {key:"feature.glossar", desc:"Begriffe einfach.", link:"#recht", type:"faq"},
    {key:"feature.locks", desc:"Was lohnt sich?", link:"#smart", type:"table"},
    {key:"feature.foerderungberlin", desc:"Lokal kompakt.", link:"#news", type:"list"},
    {key:"feature.nebenkostenrechner", desc:"Rechner & Anteile.", link:"#finanzen", type:"calc"},
    {key:"feature.zins", desc:"Historie & heute.", link:"#", type:"chart"},
    {key:"feature.faqmieter", desc:"Rechte & Pflichten.", link:"#recht", type:"faq"},
    {key:"feature.faqeigentuemer", desc:"Pflichten & Chancen.", link:"#recht", type:"faq"}
  ];

  function render(dict, lang){
    const grid=document.getElementById('featureGrid');
    if(!grid) return;
    const t=(k)=> (dict[lang]&&dict[lang][k]) || (dict.de&&dict.de[k]) || k;
    const html = FEATURES_I18N.map((f,i)=>`
      <div class="card p-3 kachel">
        <h5 class="mb-1"><span data-i18n="${f.key}">${t(f.key)}</span></h5>
        <p class="small-muted mb-2">${f.desc}</p>
        <div class="d-flex gap-2">
          <a href="${f.link}" class="btn btn-sm btn-outline-primary"><span data-i18n="btn.open">${t('btn.open')}</span></a>
          <button class="btn btn-sm btn-accent" onclick="openFeature(${i})"><span data-i18n="btn.interact">${t('btn.interact')}</span></button>
        </div>
      </div>
    `).join('');
    grid.innerHTML = html;
  }

  function boot(){
    const lang=getLang();
    fetch('data/lang.json',{cache:'no-store'})
      .then(r=>r.json())
      .then(dict=>render(dict,lang))
      .catch(()=>{ /* wenn Fehler, lassen wir die alte renderFeatures-Ausgabe stehen */ });
  }

  // Nach dem vorhandenen renderFeatures() nochmal überschreiben (damit i18n greift)
  window.addEventListener('DOMContentLoaded', ()=> setTimeout(boot, 150));
})();
