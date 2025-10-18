(function(){
  const d=document.getElementById('debugSection');
  if(!d) return;
  const q=new URLSearchParams(location.search);
  if(q.get('debug')==='1'){ d.style.display='block'; } else { d.remove(); }
})();
