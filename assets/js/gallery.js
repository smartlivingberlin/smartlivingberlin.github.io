(function(){
  const el=document.getElementById('gallery'); if(!el) return;
  const topics=["smart home","interior","architecture","minimal","cozy","energy","kitchen","living room","bathroom"];
  el.innerHTML = topics.map(t=>`<img decoding="async" loading="lazy" class="img-fluid rounded" alt="${t}" src="https://source.unsplash.com/400x300/?${encodeURIComponent(t)}">`).join('');
})();
