// Justice – render products from products.json + search + price filter

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  const priceFilter = document.getElementById("priceFilter");

  let products = [];

  // Load products.json (bust cache so GitHub Pages updates immediately)
  const url = "products.json?v=" + Date.now();
  fetch(url, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`products.json ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("products.json must be an array []");
      products = data;
      render(products);
      wireFilters(); // activate search/filter after first render
    })
    .catch((err) => {
      console.error("Failed to load products.json:", err);
      if (grid) grid.innerHTML =
        `<p class="small">Could not load <code>products.json</code>. Make sure it sits next to <code>index.html</code> and is valid JSON. (${err.message})</p>`;
    });

  function render(list) {
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = `<p class="small">No products match your filters.</p>`;
      return;
    }
    grid.innerHTML = list.map(toCardHtml).join("");
  }

  function toCardHtml(p) {
    const badge = p.badge
      ? `<span class="badge ${p.badge.toLowerCase()==="hot"?"badge-hot":"badge-deal"}" style="position:absolute;top:10px;left:10px">${escapeHtml(p.badge)}</span>`
      : "";
    const was = p.priceWas ? `<span class="was">$${escapeHtml(p.priceWas)}</span>` : "";
    return `
      <article class="card">
        ${badge}
        <a class="card-media" href="${escapeAttr(p.url)}" target="_blank" rel="nofollow noopener">
          <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title||"")}" />
        </a>
        <div class="card-body">
          <a class="card-title" href="${escapeAttr(p.url)}" target="_blank" rel="nofollow noopener">${escapeHtml(p.title||"")}</a>
          <div class="card-price">
            <span class="now">$${escapeHtml(p.priceNow)}</span>
            ${was}
          </div>
          <div class="card-actions">
            <a class="btn btn-primary cta" href="${escapeAttr(p.url)}" target="_blank" rel="nofollow noopener">Buy</a>
            <a class="btn btn-ghost" href="#">Details</a>
          </div>
        </div>
      </article>
    `;
  }

  function wireFilters() {
    searchInput && searchInput.addEventListener("input", filterNow);
    priceFilter && priceFilter.addEventListener("change", filterNow);
  }

  function filterNow() {
    const term = (searchInput?.value || "").toLowerCase();
    const range = priceFilter?.value || "";

    const filtered = products.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const price = Number(p.priceNow) || 0;

      let ok = title.includes(term);
      if (range === "under25") ok = ok && price < 25;
      if (range === "25to50") ok = ok && price >= 25 && price <= 50;
      if (range === "over50") ok = ok && price > 50;

      return ok;
    });

    render(filtered);
  }

  // tiny escapers to avoid broken HTML on odd characters
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
});

// Simple cookie banner logic (optional, leave if you already had it)
(() => {
  const banner = document.getElementById("cookieBanner");
  if (!banner) return;
  const KEY = "justice_cookie_accept";
  if (!localStorage.getItem(KEY)) banner.hidden = false;
  document.getElementById("cookieAccept")?.addEventListener("click", () => { localStorage.setItem(KEY, "1"); banner.hidden = true; });
  document.getElementById("cookieDeny")?.addEventListener("click", () => (banner.hidden = true));
})();
