function slbShare(url,title){
  const u=encodeURIComponent(url||location.href);
  const t=encodeURIComponent(title||document.title);
  return {
    x:`https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    fb:`https://www.facebook.com/sharer/sharer.php?u=${u}`,
    li:`https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    wa:`https://wa.me/?text=${t}%20${u}`
  };
}
function renderShare(elId){
  const el=document.getElementById(elId||'shareBox'); if(!el) return;
  const l=slbShare();
  el.innerHTML=`
    <div class="d-flex gap-2 flex-wrap">
      <a class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener" href="${l.x}">X/Twitter</a>
      <a class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener" href="${l.li}">LinkedIn</a>
      <a class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener" href="${l.fb}">Facebook</a>
      <a class="btn btn-sm btn-outline-success" target="_blank" rel="noopener" href="${l.wa}">WhatsApp</a>
      <button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(location.href)">Link kopieren</button>
    </div>`;
}
document.addEventListener('DOMContentLoaded',()=>renderShare());
