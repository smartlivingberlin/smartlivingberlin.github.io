document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-include]').forEach(async el=>{
    try{
      const r = await fetch(el.getAttribute('data-include'), {cache:'no-store'});
      el.innerHTML = r.ok ? await r.text() : '<div class="text-muted small">Snippet nicht gefunden.</div>';
    }catch{ el.innerHTML = '<div class="text-muted small">Snippet Fehler.</div>'; }
  });
});
