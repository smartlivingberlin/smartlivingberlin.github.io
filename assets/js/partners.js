async function loadPartners(){
  const res = await fetch('data/partners.json',{cache:'no-store'});
  const partners = await res.json();
  const el = document.getElementById('partnersList');
  if(!el) return;
  el.innerHTML = partners.map(p => `
    <div class="col-md-4 mb-3">
      <div class="card p-3 h-100">
        <h5>${p.name}</h5>
        <div class="small-muted">${p.focus}</div>
        <div>${p.region}</div>
        <a href="mailto:${p.contact}">${p.contact}</a><br>
        <a href="${p.website}" target="_blank">Website</a>
      </div>
    </div>`).join('');
}
document.addEventListener('DOMContentLoaded', loadPartners);
