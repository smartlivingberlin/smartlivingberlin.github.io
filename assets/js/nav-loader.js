(function(){
  function mountNav(html){
    var host = document.getElementById('nav-placeholder');
    if(host) host.innerHTML = html;
  }
  fetch('nav.html', {cache:'no-store'})
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(mountNav)
    .catch(()=>mountNav('<nav class="navbar navbar-dark bg-dark"><div class="container"><a class="navbar-brand" href="index.html">SmartLivingBerlin</a></div></nav>'));
})();
