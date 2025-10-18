async function loadProjects(){
  const res = await fetch('data/projects.json',{cache:'no-store'});
  const projects = await res.json();
  const el = document.getElementById('projectsList');
  if(!el) return;
  el.innerHTML = projects.map(p => `
    <div class="col-md-6 mb-3">
      <div class="card p-3 h-100">
        <h5>${p.title}</h5>
        <p>${p.description}</p>
        <div class="small-muted">Status: ${p.status}</div>
        <a href="${p.link}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Projekt beitreten</a>
      </div>
    </div>`).join('');
}
document.addEventListener('DOMContentLoaded', loadProjects);
