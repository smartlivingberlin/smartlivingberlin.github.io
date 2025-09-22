(function(){
  const map = {
    "Immobilienpreise 2025":"themen/immobilienpreise-2025.html",
    "Fördermittel-Finder":"themen/sanierung-foerderung.html",
    "Smart-Home Spartipps":"themen/energie.html",
    "Nebenkosten verstehen":"themen/mieter-rechte.html",
    "Mietrecht kompakt":"themen/mieter-rechte.html",
    "Mieten vs. Kaufen":"themen/mieten-kaufen.html",
    "Hypotheken-Rechner":"themen/hypotheken-rechner.html",
    "Energie & Sanierung":"themen/sanierung-foerderung.html",
    "WEG – Eigentümerwissen":"themen/mieter-rechte.html",
    "Grundsteuer & Betriebskosten":"themen/zins-und-finanzierung.html",
    "Smart Meter Pflicht?":"themen/eeg-kompakt.html",
    "Interior Budget Tricks":"themen/homestaging.html",
    "Homestaging DIY":"themen/homestaging.html",
    "Grundriss optimieren":"themen/grundriss-tricks.html",
    "Rendite-Hotspots":"themen/immobilienpreise-2025.html",
    "Finanzierungsirrtuemer":"themen/zins-und-finanzierung.html",
    "Modernisierungsfahrplan":"themen/sanierung-foerderung.html",
    "Mietspiegel & Bezirke":"themen/immobilienpreise-2025.html",
    "Versicherungen im Überblick":"themen/zins-und-finanzierung.html",
    "Tiny House / Co-Living":"themen/wohnenneu.html",
    "Architektur-Inspiration":"themen/homestaging.html",
    "Energiepreise verstehen":"themen/eeg-kompakt.html",
    "Checklisten (PDF)":"themen/mieter-rechte.html",
    "Glossar: Grundbuch, Erbpacht …":"themen/mieter-rechte.html",
    "Smart Locks & Sicherheit":"themen/homestaging.html",
    "Förderung Berlin":"themen/sanierung-foerderung.html",
    "Kaufnebenkosten":"themen/mieten-kaufen.html",
    "Zinsentwicklung":"themen/zins-und-finanzierung.html",
    "FAQ für Mieter":"themen/mieter-rechte.html",
    "FAQ für Eigentümer":"themen/mieter-rechte.html",
    "Bieterverfahren (Light)":"themen/auktion.html",
    "Projekt einreichen":"themen/submit.html",
    "Zwangsversteigerung (ZVG)":"themen/zvg.html"
  };
  function fix(){
    const cards = document.querySelectorAll('#featureGrid .card');
    cards.forEach(card=>{
      const h = card.querySelector('h5'); if(!h) return;
      const title = h.textContent.trim();
      const aOpen = card.querySelector('a.btn-outline-primary');
      if(aOpen && map[title]) aOpen.href = map[title];
    });
  }
  window.addEventListener('DOMContentLoaded', ()=>setTimeout(fix,150));
})();
