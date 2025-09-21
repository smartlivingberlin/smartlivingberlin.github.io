(function(){
  // Hilfsfunktion: Icon + Titel + Text + Link in einer Kachel
  function card(icon, title, desc, link, type){
    return `
      <div class="card p-3 kachel h-100">
        <div class="d-flex align-items-center mb-2">
          <i class="bi ${icon}" style="font-size:1.4rem;margin-right:.5rem"></i>
          <h5 class="mb-0">${title}</h5>
        </div>
        <p class="small-muted mb-2">${desc}</p>
        <div class="d-flex gap-2 mt-auto">
          <a href="${link||'#'}" class="btn btn-sm btn-outline-primary"${link? '' : ' disabled aria-disabled="true"'}>Öffnen</a>
          <button class="btn btn-sm btn-accent" onclick="openFeature(0)">Interaktiv</button>
        </div>
      </div>`;
  }

  // 30 Blickfang-Themen – mit echten Links auf deine Seiten
  const FEAT = [
    {i:'bi-graph-up-arrow', t:'Immobilienpreise 2025', d:'Entwicklung & Rendite – kurz erklärt.', l:'themen/immobilienpreise.html'},
    {i:'bi-piggy-bank',     t:'Fördermittel-Finder',   d:'KfW/BAFA kompakt.',                      l:'themen/foerdermittel.html'},
    {i:'bi-house-gear',     t:'Smart-Home Spartipps',  d:'Geräte, Komfort & Einsparung.',          l:'themen/smart.html'},
    {i:'bi-receipt',        t:'Nebenkosten verstehen', d:'Umlagefähig vs. nicht.',                 l:'themen/nebenkosten.html'},
    {i:'bi-journal-text',   t:'Mietrecht kompakt',     d:'§ 535/536/556 BGB einfach.',             l:'themen/mieter-rechte.html'},
    {i:'bi-cash-coin',      t:'Mieten vs. Kaufen',     d:'Vergleich & Hinweise.',                  l:'themen/zins-und-finanzierung.html'},
    {i:'bi-calculator',     t:'Hypotheken-Rechner',    d:'Annuität & Tilgung (auf Startseite).',   l:'#finanzen'},
    {i:'bi-lightning-charge',t:'Energie & Sanierung',  d:'Was lohnt sich wann?',                   l:'themen/sanierung-foerderung.html'},
    {i:'bi-people',         t:'WEG – Eigentümerwissen',d:'Beschlüsse & Verwaltung.',               l:'themen/mieter-rechte.html'},
    {i:'bi-clipboard-data', t:'Grundsteuer & BK',      d:'Kurzüberblick.',                         l:'themen/nebenkosten.html'},
    {i:'bi-speedometer',    t:'Smart Meter Pflicht?',  d:'Praxisnah erklärt.',                     l:'themen/smart.html'},
    {i:'bi-brush',          t:'Interior Budget Tricks',d:'Günstig & stilvoll.',                    l:'themen/homestaging.html'},
    {i:'bi-sliders',        t:'Homestaging DIY',       d:'Vorher/Nachher & Checkliste.',           l:'themen/homestaging.html'},
    {i:'bi-grid-3x3-gap',   t:'Grundriss optimieren',  d:'Zonen, Licht, Wege.',                    l:'themen/grundriss-tricks.html'},
    {i:'bi-geo-alt',        t:'Rendite-Hotspots',      d:'Lage & Mikrolage.',                       l:'themen/immobilienpreise.html'},
    {i:'bi-exclamation-triangle', t:'Finanzierungsirrtümer', d:'10 Fehler vermeiden.',            l:'themen/zins-und-finanzierung.html'},
    {i:'bi-clipboard-check',t:'Modernisierungsfahrplan',d:'Schrittweise zur Effizienz.',          l:'themen/sanierung-foerderung.html'},
    {i:'bi-map',            t:'Mietspiegel & Bezirke', d:'Preisgefühl gewinnen.',                  l:'themen/immobilienpreise.html'},
    {i:'bi-shield-check',   t:'Versicherungen im Überblick', d:'Was ist sinnvoll?',               l:'themen/versicherungen.html'},
    {i:'bi-people-fill',    t:'Wohnen neu denken',     d:'Co-Living, Tiny House.',                 l:'themen/projekte.html'},
    {i:'bi-bricks',         t:'Architektur-Inspiration',d:'Stile & Beispiele.',                    l:'themen/projekte.html'},
    {i:'bi-fuel-pump',      t:'Energiepreise verstehen',d:'Trends & Sparen.',                      l:'themen/energiepreise.html'},
    {i:'bi-check2-square',  t:'Checklisten (PDF)',     d:'Kauf · Übergabe · Vermietung.',          l:'themen/projekte.html'},
    {i:'bi-book',           t:'Glossar: Grundbuch…',   d:'Begriffe einfach.',                      l:'themen/glossar.html'},
    {i:'bi-door-closed',    t:'Smart Locks & Sicherheit', d:'Was lohnt sich?',                    l:'themen/smart.html'},
    {i:'bi-building',       t:'Förderung Berlin',      d:'Lokal kompakt.',                         l:'themen/foerdermittel.html'},
    {i:'bi-percent',        t:'Kaufnebenkosten',       d:'Rechner & Anteile.',                     l:'themen/nebenkosten.html'},
    {i:'bi-activity',       t:'Zinsentwicklung',       d:'Historie & heute (Chart).',              l:'#finanzen'},
    {i:'bi-emoji-smile',    t:'FAQ für Mieter',        d:'Pflichten & Rechte.',                    l:'themen/mieter-rechte.html'},
    {i:'bi-emoji-sunglasses',t:'FAQ für Eigentümer',   d:'Pflichten & Chancen.',                   l:'themen/versicherungen.html'},
    // Bonus: deine neuen "Plattform"-Funktionen:
    {i:'bi-megaphone',      t:'Bieterverfahren (Light)', d:'Gebote via GitHub-Issues.',            l:'themen/auktion.html'},
    {i:'bi-upload',         t:'Projekt einreichen',    d:'Dein Projekt sichtbar machen.',          l:'themen/submit.html'},
    {i:'bi-hammer',         t:'ZVG – Überblick',       d:'Links & Hinweise.',                      l:'themen/zvg.html'}
  ].slice(0,30); // falls mehr als 30, hier begrenzen

  function renderGrid(){
    const grid = document.getElementById('featureGrid');
    if(!grid) return;
    const rows = FEAT.map(f => card(f.i,f.t,f.d,f.l,f.type));
    grid.innerHTML = rows.join('');
  }
  window.addEventListener('DOMContentLoaded', ()=> setTimeout(renderGrid, 200));
})();
