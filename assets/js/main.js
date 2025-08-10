\
// Cookie banner
(function(){
  const banner = document.getElementById('cookieBanner');
  if(!banner) return;
  const KEY = 'justice_cookie_accept';
  if(!localStorage.getItem(KEY)){ banner.hidden = false; }
  document.getElementById('cookieAccept').addEventListener('click', ()=>{
    localStorage.setItem(KEY,'1'); banner.hidden = true;
  });
  document.getElementById('cookieDeny').addEventListener('click', ()=> banner.hidden = true);
})();

// Render grid from products.json
async function renderProducts(){
  const grid = document.getElementById('grid');
  try{
    const res = await fetch('products.json', {cache:'no-store'});
    if(!res.ok) throw new Error('Failed to load products.json');
    const items = await res.json();
    grid.innerHTML = items.map(it => `
      <article class="card">
        ${it.badge ? `<span class="badge ${it.badge.toLowerCase()==='hot'?'badge-hot':'badge-deal'}" style="position:absolute;top:10px;left:10px">${it.badge}</span>`:''}
        <a class="card-media" href="${it.url}" target="_blank" rel="nofollow noopener">
          <img src="${it.image}" alt="${it.title}">
        </a>
        <div class="card-body">
          <a class="card-title" href="${it.url}" target="_blank" rel="nofollow noopener">${it.title}</a>
          <div class="card-price">
            <span class="now">$${it.priceNow}</span>
            ${it.priceWas ? `<span class="was">$${it.priceWas}</span>`:''}
          </div>
          <div class="card-actions">
            <a class="btn btn-primary cta" href="${it.url}" target="_blank" rel="nofollow noopener">Buy</a>
            <a class="btn btn-ghost" href="#">Details</a>
          </div>
        </div>
      </article>
    `).join('');
  }catch(err){
    grid.innerHTML = `<p class="small">Could not load products.json. Make sure it sits next to index.html. Error: ${err.message}</p>`;
  }
}
document.addEventListener('DOMContentLoaded', renderProducts);
