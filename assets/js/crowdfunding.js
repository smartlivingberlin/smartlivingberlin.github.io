async function loadCrowdfunding(){
  const res = await fetch('data/crowdfunding.json',{cache:'no-store'});
  const items = await res.json();
  const el = document.getElementById('crowdfundingList');
  if(!el) return;
  el.innerHTML = items.map(i => {
    const pct = Math.min(100, Math.round(i.current / i.goal * 100));
    return `
      <div class="col-md-6 mb-3">
        <div class="card p-3 h-100">
          <h5>${i.title}</h5>
          <p>${i.description}</p>
          <div class="small-muted">Status: ${i.status}</div>
          <div class="progress mb-2">
            <div class="progress-bar bg-success" role="progressbar" style="width:${pct}%">${pct}%</div>
          </div>
          <a href="${i.link}" target="_blank" class="btn btn-sm btn-outline-primary">Projekt unterstützen</a>
        </div>
      </div>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', loadCrowdfunding);
