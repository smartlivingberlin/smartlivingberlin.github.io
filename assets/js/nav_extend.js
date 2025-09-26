document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('.navbar-nav'); if(!nav) return;
  const add=(href,text)=>{ if(!document.querySelector(`a.nav-link[href="${href}"]`)){
    const li=document.createElement('li'); li.className='nav-item';
    li.innerHTML=`<a class="nav-link" href="${href}">${text}</a>`;
    nav.appendChild(li);
  }};
  add('#services','Handwerker');
  add('#events','Events');
  add('#projects','Projekte');
  add('#partners','Partner');
  add('#crowdfunding','Crowdfunding');
  add('#investors','Investoren');
});
