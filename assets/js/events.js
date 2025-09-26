async function loadEvents(){
  const res = await fetch('data/events.json', {cache:'no-store'});
  const events = await res.json();
  const container = document.getElementById('eventsList');
  if (!container) return;
  container.innerHTML = events.map(e => `
    <div class="col-md-6 mb-3">
      <div class="card p-3 h-100">
        <h5>${e.title}</h5>
        <div class="small-muted">${e.date} – ${e.location}</div>
        <p>${e.description}</p>
        <a class="btn btn-outline-primary btn-sm" href="${e.link}" target="_blank">Mehr Info</a>
      </div>
    </div>
  `).join('');
}
document.addEventListener('DOMContentLoaded', loadEvents);
