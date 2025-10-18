async function loadInvestors(){
  const res = await fetch('data/investors.json',{cache:'no-store'});
  const items = await res.json();
  const el = document.getElementById('investorsList');
  if(!el) return;
  el.innerHTML = items.map(inv => `
    <div class="col-md-4 mb-3">
      <div class="card p-3 h-100">
        <h5>${inv.name}</h5>
        <div class="small-muted">${inv.focus}</div>
        <div>Ticket: ${inv.ticket_size}</div>
        <a href="mailto:${inv.contact}">${inv.contact}</a><br>
        <a href="${inv.website}" target="_blank">Website</a>
      </div>
    </div>`).join('');
}
document.addEventListener('DOMContentLoaded', loadInvestors);
