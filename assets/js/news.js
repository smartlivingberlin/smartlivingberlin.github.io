(async function(){
  const topEl = document.getElementById('top5-container'); if(!topEl) return;
  // Lade News
  let data=[]; try{ data = await (window.fetchJSON?fetchJSON('data/news.json'):[]); }catch{}
  if(!Array.isArray(data) || !data.length){ topEl.textContent='Noch keine Daten.'; return; }
  // Sortierung: score DESC, sonst nach Datum
  data.sort((a,b)=>{
    const sa=(+a.score||0), sb=(+b.score||0);
    if(sb!==sa) return sb-sa;
    return new Date(b.date)-new Date(a.date);
  });
  const top = data.slice(0,5);
  topEl.innerHTML = '<ol class="mb-0 small">'+ top.map(n=>(
    `<li><a target="_blank" rel="noopener" href="${n.link||'#'}">${n.title||'—'}</a>
       <span class="text-muted"> · ${(n.source|| (n.link?new URL(n.link).hostname:''))}</span></li>`
  )).join('') + '</ol>';
})();
