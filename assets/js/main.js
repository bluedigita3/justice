document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  const priceFilter = document.getElementById("priceFilter");

  let products = [];

  // Load products.json (bust cache)
  fetch("products.json?v=" + Date.now(), { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("products.json not found (" + res.status + ")");
      return res.json();
    })
    .then((data) => {
      products = Array.isArray(data) ? data : [];
      render(products);
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML = `<p class="small">Could not load <code>products.json</code>. Make sure it's next to <code>index.html</code>. Error: ${err.message}</p>`;
    });

  function render(list) {
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = `<p class="small">No products match your filters.</p>`;
      return;
    }
    grid.innerHTML = list
      .map((p) => {
        const badge =
          p.badge
            ? `<span class="badge ${p.badge.toLowerCase() === "hot" ? "badge-hot" : "badge-deal"}" style="position:absolute;top:10px;left:10px">${p.badge}</span>`
            : "";
        const was = p.priceWas ? `<span class="was">$${p.priceWas}</span>` : "";
        return `
        <article class="card">
          ${badge}
          <a class="card-media" href="${p.url}" target="_blank" rel="nofollow noopener">
            <img src="${p.image}" alt="${escapeHtml(p.title || "")}">
          </a>
          <div class="card-body">
            <a class="card-title" href="${p.url}" target="_blank" rel="nofollow noopener">${escapeHtml(p.title || "")}</a>
            <div class="card-price">
              <span class="now">$${p.priceNow}</span>
              ${was}
            </div>
            <div class="card-actions">
              <a class="btn btn-primary cta" href="${p.url}" target="_blank" rel="nofollow noopener">Buy</a>
              <a class="btn btn-ghost" href="#">Details</a>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  function filterNow() {
    const term = (searchInput?.value || "").toLowerCase();
    const range = priceFilter?.value || "";

    const filtered = products.filter((p) => {
      const t = (p.title || "").toLowerCase();
      const price = Number(p.priceNow) || 0;

      let ok = t.includes(term);
      if (range === "under25") ok = ok && price < 25;
      if (range === "25to50") ok = ok && price >= 25 && price <= 50;
      if (range === "over50") ok = ok && price > 50;

      return ok;
    });

    render(filtered);
  }

  // Wire up filters
  searchInput && searchInput.addEventListener("input", filterNow);
  priceFilter && priceFilter.addEventListener("change", filterNow);

  // Escape HTML for safety
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }
});
