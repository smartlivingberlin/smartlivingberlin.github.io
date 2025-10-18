async function loadLawCases(){
  const res = await fetch('data/law_cases.json',{cache:'no-store'});
  const cases = await res.json();
  const el = document.getElementById('lawCasesList');
  if(!el) return;
  el.innerHTML = cases.map(c => `
    <div class="mb-3">
      <strong>${c.paragraph}: ${c.title}</strong>
      <p class="small">${c.brief}</p>
      <span class="small-muted">Quelle: ${c.source}</span>
    </div>`).join('');
}
document.addEventListener('DOMContentLoaded', loadLawCases);
