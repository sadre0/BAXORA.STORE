const SUPABASE_URL = "https://sixuklztzisetrbgxplp.supabase.co";
const SUPABASE_KEY = "sb_publishable_xI5S3GmGD5ZEDLVRd7ujZA_TBe4HwNt";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let products = [];
let activeCategory = "All";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderProducts() {
  const grid = document.getElementById("products");
  if (!grid) return;

  const search = (
    document.getElementById("search")?.value || ""
  ).trim().toLowerCase();

  const filtered = products.filter(p => {
    const category = (p.category || "").toLowerCase();

    const categoryMatch =
      activeCategory === "All" ||
      (activeCategory === "Bags" && category.includes("bag")) ||
      category === activeCategory.toLowerCase();

    const searchMatch =
      (p.name || "").toLowerCase().includes(search);

    return categoryMatch && searchMatch;
  });

  if (!filtered.length) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const name = escapeHTML(p.name);
    const category = escapeHTML(p.category || "Bags");
    const image = escapeHTML(
      p.image_url || "assets/baxora-logo.png"
    );

    const price = p.price == null
      ? "Price on WhatsApp"
      : "₹" + Number(p.price).toLocaleString("en-IN");

    const message = encodeURIComponent(
      "Hello BAXORA, I am interested in " + p.name
    );

    return `
      <article class="card">
        <img
          src="${image}"
          alt="${name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='assets/baxora-logo.png'"
        >
        <div class="info">
          <small>${category}</small>
          <h3>${name}</h3>
          <p>${price}</p>
          <a
            href="https://wa.me/919135147273?text=${message}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire on WhatsApp ↗
          </a>
        </div>
      </article>
    `;
  }).join("");
}

async function loadProducts() {
  const grid = document.getElementById("products");

  if (grid) {
    grid.innerHTML = "<p>Loading BAXORA products...</p>";
  }

  const { data, error } = await db
    .from("products")
    .select("id,name,description,price,image_url,category,is_active,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("BAXORA Supabase error:", error);

    if (grid) {
      grid.innerHTML =
        "<p>Products could not be loaded. Please try again later.</p>";
    }
    return;
  }

  products = data || [];
  renderProducts();
}

document.querySelectorAll("[data-cat]").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.cat || "All";

    document.querySelectorAll("[data-cat]").forEach(item => {
      item.classList.remove("chosen");
    });

    button.classList.add("chosen");
    renderProducts();
  });
});

document.getElementById("search")?.addEventListener(
  "input",
  renderProducts
);

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

loadProducts();
