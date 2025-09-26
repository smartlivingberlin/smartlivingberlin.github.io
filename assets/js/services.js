async function loadServices(){
  const res = await fetch('data/services.json', {cache:'no-store'});
  const services = await res.json();
  const container = document.getElementById('servicesList');
  if (!container) return;
  container.innerHTML = services.map(s => `
    <div class="col-md-4 mb-3">
      <div class="card p-3 h-100">
        <h5>${s.name}</h5>
        <div class="small-muted">${s.category} – ${s.region}</div>
        <div><a href="tel:${s.phone}">${s.phone}</a></div>
        <div><a href="${s.website}" target="_blank">Website</a></div>
      </div>
    </div>
  `).join('');
}
document.addEventListener('DOMContentLoaded', loadServices);
