const defaultProducts = [
  {
    id: 1,
    name: "White Quilted Mini Backpack",
    category: "Bags",
    image: "assets/white-mini-backpack.png"
  },
  {
    id: 2,
    name: "BAXORA Black & Orange Backpack",
    category: "Bags",
    image: "assets/baxora-black-orange-backpack.png"
  },
  {
    id: 3,
    name: "Customizable Backpack",
    category: "Bags",
    image: "assets/custom-backpack.png"
  }
];

let products = JSON.parse(
  localStorage.getItem("baxoraProducts") || "null"
) || defaultProducts;

let activeCategory = "All";

function renderProducts() {
  const grid = document.getElementById("products");
  if (!grid) return;

  const search = (
    document.getElementById("search")?.value || ""
  ).toLowerCase();

  const filtered = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search)
  );

  grid.innerHTML = filtered.map(p => `
    <article class="product">
      <div class="pic">
        <img src="${p.image}" alt="${p.name}"
          style="width:100%;height:190px;object-fit:cover"
          onerror="this.src='assets/baxora-logo.png'">
      </div>
      <div>
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <p>Price on WhatsApp</p>
        <a target="_blank" href="https://wa.me/919135147273?text=${encodeURIComponent('Hello BAXORA, I am interested in '+p.name)}">
          Enquire on WhatsApp ↗
        </a>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll("[data-cat]").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.cat;
    renderProducts();
  });
});

document.getElementById("search")?.addEventListener(
  "input", renderProducts
);

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();

