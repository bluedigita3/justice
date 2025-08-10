document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid"); // product grid container
  const searchInput = document.getElementById("search");
  const priceFilter = document.getElementById("priceFilter");

  let productsData = [];

  // Load products from products.json
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      productsData = data;
      renderProducts(productsData);
    })
    .catch(err => console.error("Error loading products.json:", err));

  // Render product cards
  function renderProducts(items) {
    grid.innerHTML = "";
    if (items.length === 0) {
      grid.innerHTML = "<p>No products match your filters.</p>";
      return;
    }
    items.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>
          <span class="price-now">$${p.priceNow}</span>
          <span class="price-was">$${p.priceWas}</span>
        </p>
        <a href="${p.url}" target="_blank" class="btn">Buy Now</a>
      `;
      grid.appendChild(card);
    });
  }

  // Filter products based on search and price
  function filterProducts() {
    let term = searchInput.value.toLowerCase();
    let priceRange = priceFilter.value;

    let filtered = productsData.filter(p => {
      let matchesSearch = p.title.toLowerCase().includes(term);
      let matchesPrice = true;

      if (priceRange === "under25") matchesPrice = Number(p.priceNow) < 25;
      if (priceRange === "25to50") matchesPrice = Number(p.priceNow) >= 25 && Number(p.priceNow) <= 50;
      if (priceRange === "over50") matchesPrice = Number(p.priceNow) > 50;

      return matchesSearch && matchesPrice;
    });

    renderProducts(filtered);
  }

  // Listen for changes
  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (priceFilter) priceFilter.addEventListener("change", filterProducts);
});
