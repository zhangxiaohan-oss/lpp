const products = [
  {
    id: 29327,
    title: "customize",
    price: null,
    priceLabel: "Custom quote",
    image: "assets/product-01.jpg",
    source: "https://lpphatshop.com/product/customize/",
    tags: ["custom", "wholesale", "straw hat"],
    description:
      "Customization area for choosing color and size, then contacting customer service with order requirements. Wholesale pricing: 50-200 units at $6.19, 200-500 units at $4.50, 500+ units at $3.50. Shipping is quoted separately."
  },
  {
    id: 29321,
    title:
      "Wholesale custom-made logo summer adult surfing beach straw hats, natural hollow straw, bulk men's and women's lifeguard straw hats",
    price: 30.9,
    image: "assets/product-02.jpg",
    source:
      "https://lpphatshop.com/product/wholesale-custom-made-logo-summer-adult-surfing-beach-straw-hats-natural-hollow-straw-bulk-mens-and-womens-lifeguard-straw-hats/",
    tags: ["custom", "wholesale", "surf"],
    description:
      "Bulk summer straw hat with logo-ready styling, natural hollow straw construction, and unisex lifeguard use cases."
  },
  {
    id: 29315,
    title:
      "Wholesale summer sun lifeguard straw hats, custom logo prints, American style straw hats, surfing lifeguard straw hats",
    price: 29.9,
    image: "assets/product-03.jpg",
    source:
      "https://lpphatshop.com/product/wholesale-summer-sun-lifeguard-straw-hats-custom-logo-prints-american-style-straw-hats-surfing-lifeguard-straw-hats/",
    tags: ["custom", "lifeguard", "surf", "wholesale"],
    description:
      "American-style lifeguard straw hat focused on summer sun coverage, custom logo print options, and surf culture."
  },
  {
    id: 29309,
    title: "Plain wide-brimmed sun hat for lifeguards, farmers, and gardeners",
    price: 28.9,
    image: "assets/product-04.jpeg",
    source:
      "https://lpphatshop.com/product/plain-wide-brimmed-sun-hat-for-lifeguards-farmers-and-gardeners/",
    tags: ["lifeguard", "outdoor"],
    description:
      "Plain wide-brim sun hat for lifeguards, farming, gardening, and daily outdoor sun protection."
  },
  {
    id: 29303,
    title:
      "Wholesale summer sun lifeguard straw hats, custom logo prints, American straw hats, surfing lifeguard natural straw hats",
    price: 30.9,
    image: "assets/product-05.jpeg",
    source:
      "https://lpphatshop.com/product/wholesale-summer-sun-lifeguard-straw-hats-custom-logo-prints-american-straw-hats-surfing-lifeguard-natural-straw-hats/",
    tags: ["custom", "lifeguard", "surf", "wholesale"],
    description:
      "Wholesale natural straw lifeguard hat with American-style shape and logo print positioning."
  },
  {
    id: 29297,
    title:
      "Wholesale wide-brimmed summer designer printed sun beach lifeguard surfing hunting fishing woven straw hats for men",
    price: 28.9,
    image: "assets/product-06.jpeg",
    source:
      "https://lpphatshop.com/product/wholesale-wide-brimmed-summer-designer-printed-sun-beach-lifeguard-surfing-hunting-fishing-woven-straw-hats-for-men/",
    tags: ["lifeguard", "surf", "wholesale", "fishing"],
    description:
      "Wide-brim woven straw hat built for beach, lifeguard, surfing, hunting, and fishing use."
  },
  {
    id: 29291,
    title:
      "Customized wholesale summer sunshade straw hat, natural straw lifeguard straw hat, custom logo patch",
    price: 28.9,
    image: "assets/product-07.png",
    source:
      "https://lpphatshop.com/product/customized-wholesale-summer-sunshade-straw-hat-natural-straw-lifeguard-straw-hat-custom-logo-patch/",
    tags: ["custom", "lifeguard", "wholesale"],
    description:
      "Natural straw lifeguard sunshade hat with custom logo patch direction for wholesale orders."
  },
  {
    id: 29284,
    title:
      "Summer Lifeguard Sun Protection Wide-brimmed Straw Beach Hat, Unisex, Custom Logo Patch Print, American Style Straw Hat for Surfing and Beaches",
    price: 30.9,
    image: "assets/product-08.png",
    source:
      "https://lpphatshop.com/product/summer-lifeguard-sun-protection-wide-brimmed-straw-beach-hat-unisex-custom-logo-patch-print-american-style-straw-hat-for-surfing-and-beaches/",
    tags: ["custom", "lifeguard", "surf", "beach"],
    description:
      "Unisex wide-brim beach hat with sun protection, American-style profile, and custom logo patch print."
  },
  {
    id: 29278,
    title: "Lifeguard straw hat with applique embroidered logo",
    price: 29.9,
    image: "assets/product-09.png",
    source: "https://lpphatshop.com/product/lifeguard-straw-hat-with-applique-embroidered-logo/",
    tags: ["custom", "lifeguard"],
    description:
      "Lifeguard straw hat style featuring applique embroidered logo direction for branded summer use."
  },
  {
    id: 29272,
    title:
      "Custom summer sun hat, natural grass lifeguard hat, custom logo patch, surfing adventure Panama beach hat",
    price: 28.9,
    image: "assets/product-10.png",
    source:
      "https://lpphatshop.com/product/custom-summer-sun-hat-natural-grass-lifeguard-hat-custom-logo-patch-surfing-adventure-panama-beach-hat/",
    tags: ["custom", "lifeguard", "surf", "beach"],
    description:
      "Natural grass summer sun hat for lifeguard, surfing adventure, Panama beach styling, and custom logo patches."
  },
  {
    id: 29266,
    title:
      "Wholesale high-quality custom printed summer surfing straw hats, beach hats, surfing lifeguard straw hats with logos",
    price: 30.9,
    image: "assets/product-11.png",
    source:
      "https://lpphatshop.com/product/wholesale-high-quality-custom-printed-summer-surfing-straw-hats-beach-hats-surfing-lifeguard-straw-hats-with-logos/",
    tags: ["custom", "surf", "lifeguard", "wholesale"],
    description:
      "Custom printed straw hat for summer surfing, beach, and lifeguard scenarios with logo-focused merchandising."
  },
  {
    id: 29260,
    title:
      "Unisex Fashionable Custom Logo Summer Beach Straw Hat, Natural Surfing Lifeguard Wide-brimmed Straw Hat",
    price: 29.9,
    image: "assets/product-12.png",
    source:
      "https://lpphatshop.com/product/unisex-fashionable-custom-logo-summer-beach-straw-hat-natural-surfing-lifeguard-wide-brimmed-straw-hat/",
    tags: ["custom", "surf", "lifeguard", "beach"],
    description:
      "Fashion-forward unisex beach straw hat with natural surfing and lifeguard styling."
  },
  {
    id: 29254,
    title:
      "Wholesale custom printed American straw hats, beach hats, wide-brimmed striped surfing summer sun protection lifeguard logo outdoor straw hats",
    price: 28.9,
    image: "assets/product-13.png",
    source:
      "https://lpphatshop.com/product/wholesale-custom-printed-american-straw-hats-beach-hats-wide-brimmed-striped-surfing-summer-sun-protection-lifeguard-logo-outdoor-straw-hats/",
    tags: ["custom", "surf", "lifeguard", "wholesale"],
    description:
      "Wide-brim striped American straw hat for beach, surfing, sun protection, lifeguard, and outdoor logo use."
  },
  {
    id: 29248,
    title: "Wholesale summer lifeguard straw hats, American straw hats, beach hats",
    price: 30.9,
    image: "assets/product-14.png",
    source: "https://lpphatshop.com/product/wholesale-summer-lifeguard-straw-hats-american-straw-hats-beach-hats/",
    tags: ["lifeguard", "beach", "wholesale"],
    description:
      "Wholesale summer lifeguard straw hat with American beach hat styling."
  },
  {
    id: 29242,
    title:
      "Cheap fishing mat for men and women, wide-brimmed straw, UPF 50, large sun beach boy youth 100 blue and black American flag lifeguard surfing straw hat.",
    price: 29.9,
    image: "assets/product-15.png",
    source:
      "https://lpphatshop.com/product/cheap-fishing-mat-for-men-and-women-wide-brimmed-straw-upf-50-large-sun-beach-boy-youth-100-blue-and-black-american-flag-lifeguard-surfing-straw-hat/",
    tags: ["lifeguard", "surf", "fishing", "UPF"],
    description:
      "Wide-brim straw hat listing for men, women, and youth with UPF 50 positioning and blue-black American flag surf styling."
  },
  {
    id: 29188,
    title:
      "Custom logo patch logo bottom print men's lifeguard fishing surfing lifeguard beach sun hat sun protection fishing straw hat",
    price: 28.9,
    image: "assets/product-16.png",
    source:
      "https://lpphatshop.com/product/custom-logo-patch-logo-bottom-print-mens-lifeguard-fishing-surfing-lifeguard-beach-sun-hat-sun-protection-fishing-straw-hat/",
    tags: ["custom", "lifeguard", "surf", "fishing"],
    description:
      "Men's lifeguard beach sun hat for fishing and surfing, with custom patch and bottom-print logo options."
  }
];

const sitePages = [
  {
    title: "Home",
    type: "Landing",
    text: "Hero message, promo code WDPILLS23, free shipping from $30, straw hat benefits, bestsellers, testimonials, and newsletter intent.",
    anchor: "#home"
  },
  {
    title: "Shop",
    type: "Catalog",
    text: "Complete straw hat product category with all 16 products, pricing, search, filtering, quick view, wishlist, compare, and cart UI.",
    anchor: "#shop"
  },
  {
    title: "About Us",
    type: "Brand",
    text: "Company goal: keep customers cool and protected with crafted straw hats and sun accessories from reputable manufacturing.",
    anchor: "#about"
  },
  {
    title: "Customize",
    type: "Product",
    text: "Color and size selection flow, customer-service order handoff, wholesale unit tiers, and shipping quote notice.",
    anchor: "#customize"
  },
  {
    title: "Orders Tracking",
    type: "Utility",
    text: "Order ID and billing email lookup interface for post-purchase tracking.",
    anchor: "#tracking"
  },
  {
    title: "Contact Us",
    type: "Support",
    text: "Address, hours, phone, email, map prompt, and expert-help positioning.",
    anchor: "#contact"
  },
  {
    title: "Wishlist",
    type: "Account",
    text: "Empty-state wishlist content with return-to-shop prompt and live wishlist drawer in this prototype.",
    anchor: "#pages"
  },
  {
    title: "Compare",
    type: "Shopping tool",
    text: "Empty compare-list page behavior with a live compare drawer for selected products.",
    anchor: "#pages"
  },
  {
    title: "Cart",
    type: "Shopping tool",
    text: "Shopping-cart page represented by a live side panel. Checkout integration can be connected later.",
    anchor: "#pages"
  },
  {
    title: "Checkout",
    type: "Commerce",
    text: "Checkout page placeholder represented as a future payment and address flow.",
    anchor: "#pages"
  },
  {
    title: "My Account",
    type: "Account",
    text: "Login/register account destination preserved as a future customer dashboard.",
    anchor: "#pages"
  },
  {
    title: "Blog",
    type: "Content",
    text: "Public blog page exists in the sitemap and is reserved for guides, drops, and styling stories.",
    anchor: "#pages"
  },
  {
    title: "Ingredients",
    type: "Legacy content",
    text: "Source page contains supplement-style demo content about ingredients such as iron; preserved as a page record.",
    anchor: "#pages"
  },
  {
    title: "Medical Experts",
    type: "Legacy content",
    text: "Source page contains demo expert sections and specialty labels; preserved as a page record.",
    anchor: "#pages"
  },
  {
    title: "Sample Page",
    type: "Legacy content",
    text: "Default WordPress sample page exists and is retained in the sitemap coverage list.",
    anchor: "#pages"
  }
];

const state = {
  cart: [],
  wishlist: new Set(),
  compare: new Set(),
  search: "",
  filter: "all",
  sort: "featured"
};

const money = (value) => (value === null ? "Custom" : `$${value.toFixed(2)}`);

function productMatches(product) {
  const haystack = [product.title, product.description, product.tags.join(" ")].join(" ").toLowerCase();
  const matchesSearch = !state.search || haystack.includes(state.search);
  const matchesFilter = state.filter === "all" || product.tags.map((tag) => tag.toLowerCase()).includes(state.filter);
  return matchesSearch && matchesFilter;
}

function sortedProducts() {
  const items = products.filter(productMatches);
  if (state.sort === "price-asc") {
    return items.sort((a, b) => (a.price ?? 999) - (b.price ?? 999));
  }
  if (state.sort === "price-desc") {
    return items.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  }
  if (state.sort === "name") {
    return items.sort((a, b) => a.title.localeCompare(b.title));
  }
  return items;
}

function renderProducts() {
  const grid = document.querySelector("#product-grid");
  const items = sortedProducts();

  if (!items.length) {
    grid.innerHTML = '<div class="panel-empty">No products match this search.</div>';
    return;
  }

  grid.innerHTML = items
    .map((product, index) => {
      const buttonText = product.price === null ? "Read more" : "Add to cart";
      return `
        <article class="product-card">
          <button class="product-media" type="button" data-view="${product.id}" aria-label="View ${product.title}">
            <img src="${product.image}" alt="Generated image for ${product.title}">
            <span class="quick-view">Quick view</span>
          </button>
          <div class="product-body">
            <div class="product-category">straw hat</div>
            <h3>${product.title}</h3>
            <div class="price">${product.priceLabel || money(product.price)}</div>
          </div>
          <div class="product-actions">
            <button type="button" data-cart="${product.id}">${buttonText}</button>
            <button type="button" data-wish="${product.id}" aria-label="Add ${product.title} to wishlist">W</button>
            <button type="button" data-compare="${product.id}" aria-label="Add ${product.title} to compare">C</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPages() {
  const pageGrid = document.querySelector("#page-grid");
  pageGrid.innerHTML = sitePages
    .map(
      (page) => `
        <article class="page-card">
          <span class="page-type">${page.type}</span>
          <h3>${page.title}</h3>
          <p>${page.text}</p>
          <a class="button button-ghost" href="${page.anchor}">Open section</a>
        </article>
      `
    )
    .join("");
}

function updateCounts() {
  document.querySelector("#cart-count").textContent = state.cart.length;
  document.querySelector("#wish-count").textContent = state.wishlist.size;
  document.querySelector("#compare-count").textContent = state.compare.size;
}

function findProduct(id) {
  return products.find((product) => product.id === Number(id));
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product) return;
  state.cart.push(product);
  updateCounts();
  openPanel("cart");
}

function toggleSet(setName, id) {
  const bucket = state[setName];
  const numericId = Number(id);
  if (bucket.has(numericId)) {
    bucket.delete(numericId);
  } else {
    bucket.add(numericId);
  }
  updateCounts();
  openPanel(setName === "wishlist" ? "wishlist" : "compare");
}

function openModal(id) {
  const product = findProduct(id);
  if (!product) return;
  const modal = document.querySelector("#product-modal");
  document.querySelector("#modal-content").innerHTML = `
    <article class="modal-product">
      <img src="${product.image}" alt="Generated image for ${product.title}">
      <div>
        <p class="eyebrow">Product ID ${product.id}</p>
        <h2>${product.title}</h2>
        <div class="price">${product.priceLabel || money(product.price)}</div>
        <p>${product.description}</p>
        <div class="tag-row">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <p><a class="button button-ghost" href="${product.source}" target="_blank" rel="noreferrer">Source product page</a></p>
      </div>
    </article>
  `;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.querySelector("#product-modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function panelItems(type) {
  if (type === "cart") return state.cart;
  const ids = Array.from(state[type]);
  return ids.map(findProduct).filter(Boolean);
}

function openPanel(type) {
  const panel = document.querySelector("#side-panel");
  const title = type === "cart" ? "Cart" : type === "wishlist" ? "Wishlist" : "Compare";
  const items = panelItems(type);
  document.querySelector("#panel-title").textContent = title;
  document.querySelector("#panel-content").innerHTML = items.length
    ? items
        .map(
          (product) => `
          <article class="cart-line">
            <img src="${product.image}" alt="">
            <div>
              <strong>${product.title}</strong>
              <div>${product.priceLabel || money(product.price)}</div>
            </div>
            <button type="button" data-view="${product.id}">View</button>
          </article>
        `
        )
        .join("")
    : `<div class="panel-empty">${title} is empty. Add products from the Shop section.</div>`;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
}

function closePanel() {
  const panel = document.querySelector("#side-panel");
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
}

function bindEvents() {
  document.querySelector("#search-input").addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  document.querySelector("#filter-select").addEventListener("change", (event) => {
    state.filter = event.target.value;
    renderProducts();
  });

  document.querySelector("#sort-select").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    const cartButton = event.target.closest("[data-cart]");
    const wishButton = event.target.closest("[data-wish]");
    const compareButton = event.target.closest("[data-compare]");
    const panelButton = event.target.closest("[data-panel]");

    if (viewButton) openModal(viewButton.dataset.view);
    if (cartButton) addToCart(cartButton.dataset.cart);
    if (wishButton) toggleSet("wishlist", wishButton.dataset.wish);
    if (compareButton) toggleSet("compare", compareButton.dataset.compare);
    if (panelButton) openPanel(panelButton.dataset.panel);
  });

  document.querySelector("#close-panel").addEventListener("click", closePanel);
  document.querySelector("#close-modal").addEventListener("click", closeModal);
  document.querySelector("#product-modal").addEventListener("click", (event) => {
    if (event.target.id === "product-modal") closeModal();
  });

  document.querySelector(".menu-toggle").addEventListener("click", (event) => {
    const nav = document.querySelector("#site-nav");
    const isOpen = nav.classList.toggle("is-open");
    event.currentTarget.setAttribute("aria-expanded", String(isOpen));
  });
}

renderProducts();
renderPages();
updateCounts();
bindEvents();
