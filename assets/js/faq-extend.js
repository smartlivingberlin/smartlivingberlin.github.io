document.addEventListener('DOMContentLoaded', function(){
  if(!window.FAQ) window.FAQ=[];
  (window.FAQ).push(
    {q:"Wer trägt Kleinreparaturen?", a:"Wenn wirksam vereinbart: Mieter bis ca. 100 € je Einzelfall und Jahressumme begrenzt (BGH-Rechtsprechung)."},
    {q:"Nebenkostenpauschale vs. Vorauszahlung?", a:"Pauschale = keine Abrechnung, Anpassung nur per Vereinbarung; Vorauszahlung = jährliche Abrechnung mit Nachzahlung/Erstattung."},
    {q:"Kaution – wie viel & wann zurück?", a:"Max. 3 Nettokaltmieten; Rückzahlung i.d.R. innerhalb von 3–6 Monaten nach Auszug, angemessene Prüf-/Abrechnungsfrist."}
  );
  // vorhandenes Render-Target bestücken, falls Element existiert
  var el=document.getElementById('faqList');
  if(el && window.FAQ && Array.isArray(window.FAQ)){
    el.innerHTML = window.FAQ.map(f=>`<details class="mb-2"><summary><strong>${f.q}</strong></summary><p class="mb-1">${f.a}</p></details>`).join('');
  }
});
