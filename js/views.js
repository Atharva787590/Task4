import { products, getProductBySlug, getCategories } from "./data/products.js";
import {
  getFilteredProducts,
  getState,
  getCartItemsDetailed,
  getCartSubtotal,
  isFavorite,
  getSavedProducts
} from "./store.js";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function categoryName(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function stars(rating) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function productCard(product) {
  return `
    <article class="catalog-card">
      <a class="catalog-media" href="#/product/${product.slug}">
        <img
          src="${product.image}"
          alt="${product.name}"
          width="800"
          height="600"
          loading="lazy"
        />
      </a>

      <div class="catalog-body">
        <div class="card-topline">
          <span class="badge badge--${product.badgeType === "top" ? "top" : product.badgeType === "hot" ? "hot" : "new"}">${product.badge}</span>
          <button
            class="icon-btn ${isFavorite(product.id) ? "is-active" : ""}"
            data-action="toggle-favorite"
            data-product-id="${product.id}"
            aria-label="Toggle saved product"
            type="button"
          >
            ♥
          </button>
        </div>

        <p class="category-label">${categoryName(product.category)}</p>
        <h3><a href="#/product/${product.slug}">${product.name}</a></h3>
        <p class="card-copy">${product.short}</p>

        <div class="rating-row">
          <span class="stars">${stars(product.rating)}</span>
          <span>${product.rating} • ${product.reviews} reviews</span>
        </div>

        <div class="price-row">
          <div>
            <strong class="price">${formatPrice(product.price)}</strong>
            <span class="old-price">${formatPrice(product.originalPrice)}</span>
          </div>
        </div>

        <div class="inline-actions">
          <button class="primary-btn" data-action="add-to-cart" data-product-id="${product.id}" type="button">
            Add to Cart
          </button>
          <a class="secondary-btn" href="#/product/${product.slug}">Details</a>
        </div>
      </div>
    </article>
  `;
}

export function homeView() {
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return {
    title: "NexCart — Home",
    html: `
      <section class="container hero">
        <article class="hero-card">
          <div class="hero-copy">
            <span class="kicker">Production-ready catalog</span>
            <h1 class="hero-title">Discover products designed for modern <span>everyday use.</span></h1>
            <p class="hero-text">
              NexCart is a modular shopping experience built for fast browsing, clear comparison,
              and seamless client-side navigation across products, saved items, and cart flows.
            </p>

            <div class="cta-row">
              <a class="primary-btn" href="#/products">Explore Products</a>
              <a class="secondary-btn" href="#/about">How It Works</a>
            </div>
          </div>
        </article>

        <aside class="hero-card hero-visual">
          <div class="metric-grid">
            <div class="metric-card">
              <strong>08</strong>
              <span>Curated products</span>
            </div>
            <div class="metric-card">
              <strong>SPA</strong>
              <span>Client-side routing</span>
            </div>
            <div class="metric-card">
              <strong>Fast</strong>
              <span>Lightweight SVG assets</span>
            </div>
            <div class="metric-card">
              <strong>Live</strong>
              <span>Deploy-ready architecture</span>
            </div>
          </div>
        </aside>
      </section>

      <section class="container section-block">
        <div class="section-heading">
          <div>
            <h2>Shop by category</h2>
            <p>Browse the catalog through focused product groups.</p>
          </div>
        </div>

        <div class="category-grid">
          <button class="category-card" data-action="jump-category" data-category="audio" type="button">
            <div class="category-icon" style="background:#4f46e5;">A</div>
            <h3>Audio</h3>
            <p class="card-copy">Headphones and portable speakers built for everyday listening.</p>
          </button>

          <button class="category-card" data-action="jump-category" data-category="wearables" type="button">
            <div class="category-icon" style="background:#10b981;">W</div>
            <h3>Wearables</h3>
            <p class="card-copy">Smart devices designed for movement, focus, and daily balance.</p>
          </button>

          <button class="category-card" data-action="jump-category" data-category="workspace" type="button">
            <div class="category-icon" style="background:#f59e0b;">D</div>
            <h3>Workspace</h3>
            <p class="card-copy">Refined setup essentials for productivity and desk comfort.</p>
          </button>

          <button class="category-card" data-action="jump-category" data-category="travel" type="button">
            <div class="category-icon" style="background:#0ea5e9;">T</div>
            <h3>Travel</h3>
            <p class="card-copy">Portable, durable products made for motion and flexibility.</p>
          </button>
        </div>
      </section>

      <section class="container section-block">
        <div class="section-heading">
          <div>
            <h2>Featured collection</h2>
            <p>Selected products with standout performance and presentation.</p>
          </div>
          <a class="secondary-btn" href="#/products">View full catalog</a>
        </div>

        <div class="catalog-grid">
          ${featured.map(productCard).join("")}
        </div>
      </section>

      <section class="container section-block">
        <div class="feature-grid">
          <article class="feature-card">
            <h3>Modular architecture</h3>
            <p class="card-copy">
              Built with reusable views, dedicated state management, and a clean route-driven structure.
            </p>
          </article>

          <article class="feature-card">
            <h3>Seamless navigation</h3>
            <p class="card-copy">
              Client-side routing keeps transitions fast and cohesive without full page reloads.
            </p>
          </article>

          <article class="feature-card">
            <h3>Performance-minded</h3>
            <p class="card-copy">
              Optimized inline SVG assets, lazy-loaded media, and minimal dependencies keep the app lightweight.
            </p>
          </article>
        </div>
      </section>
    `
  };
}

export function productsView() {
  const { filters } = getState();
  const items = getFilteredProducts();
  const categories = getCategories();

  return {
    title: "NexCart — Products",
    html: `
      <section class="container">
        <div class="section-heading">
          <div>
            <h2>Product catalog</h2>
            <p>Browse, filter, and compare products with a smooth route-based experience.</p>
          </div>
        </div>

        <form class="catalog-toolbar" data-form="catalog-search">
          <div class="search-box">
            <input name="search" type="text" value="${filters.search}" placeholder="Search products..." />
          </div>

          <div class="select-box">
            <select name="category">
              ${categories
                .map(
                  (category) => `
                    <option value="${category}" ${filters.category === category ? "selected" : ""}>
                      ${category === "all" ? "All Categories" : categoryName(category)}
                    </option>
                  `
                )
                .join("")}
            </select>
          </div>

          <div class="select-box">
            <select name="sort">
              <option value="featured" ${filters.sort === "featured" ? "selected" : ""}>Featured</option>
              <option value="price-asc" ${filters.sort === "price-asc" ? "selected" : ""}>Price: Low to High</option>
              <option value="price-desc" ${filters.sort === "price-desc" ? "selected" : ""}>Price: High to Low</option>
              <option value="rating" ${filters.sort === "rating" ? "selected" : ""}>Top Rated</option>
            </select>
          </div>

          <button class="primary-btn" type="submit">Apply</button>
          <button class="ghost-btn" type="button" data-action="reset-filters">Reset</button>
        </form>

        <div class="catalog-results-meta">
          Showing ${items.length} product(s)
        </div>

        ${
          items.length
            ? `<div class="catalog-grid">${items.map(productCard).join("")}</div>`
            : `
              <div class="empty-card">
                <h2>No products match your filters</h2>
                <p class="card-copy">Try resetting filters or searching with a broader term.</p>
                <div class="empty-actions">
                  <button class="secondary-btn" data-action="reset-filters" type="button">Reset Filters</button>
                </div>
              </div>
            `
        }
      </section>
    `
  };
}

export function savedView() {
  const saved = getSavedProducts();

  return {
    title: "NexCart — Saved",
    html: `
      <section class="container">
        <div class="section-heading">
          <div>
            <h2>Saved products</h2>
            <p>Your shortlisted products stay available while you continue browsing.</p>
          </div>
        </div>

        ${
          saved.length
            ? `<div class="catalog-grid">${saved.map(productCard).join("")}</div>`
            : `
              <div class="empty-card">
                <h2>No saved products yet</h2>
                <p class="card-copy">Use the heart button on any product card to save it here.</p>
                <div class="empty-actions">
                  <a class="primary-btn" href="#/products">Explore Products</a>
                </div>
              </div>
            `
        }
      </section>
    `
  };
}

export function productDetailView(slug) {
  const product = getProductBySlug(slug);

  if (!product) {
    return notFoundView();
  }

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return {
    title: `NexCart — ${product.name}`,
    html: `
      <section class="container">
        <div class="inline-actions" style="margin-bottom:1rem;">
          <a class="ghost-btn" href="#/products">← Back to products</a>
        </div>

        <div class="detail-layout">
          <div class="detail-media">
            <img
              src="${product.image}"
              alt="${product.name}"
              width="800"
              height="600"
              loading="eager"
            />
          </div>

          <div class="detail-info">
            <span class="badge badge--${product.badgeType === "top" ? "top" : product.badgeType === "hot" ? "hot" : "new"}">${product.badge}</span>
            <p class="category-label">${categoryName(product.category)}</p>
            <h1>${product.name}</h1>

            <div class="rating-row">
              <span class="stars">${stars(product.rating)}</span>
              <span>${product.rating} • ${product.reviews} reviews</span>
            </div>

            <p class="hero-text">${product.description}</p>

            <div class="price-row">
              <div>
                <strong class="price">${formatPrice(product.price)}</strong>
                <span class="old-price">${formatPrice(product.originalPrice)}</span>
              </div>
            </div>

            <div class="detail-actions">
              <button class="primary-btn" data-action="add-to-cart" data-product-id="${product.id}" type="button">
                Add to Cart
              </button>
              <button
                class="secondary-btn"
                data-action="toggle-favorite"
                data-product-id="${product.id}"
                type="button"
              >
                ${isFavorite(product.id) ? "Remove from Saved" : "Save Product"}
              </button>
            </div>

            <div class="product-highlights">
              <span class="highlight-chip">Premium build</span>
              <span class="highlight-chip">Fast browsing</span>
              <span class="highlight-chip">Route-driven UI</span>
            </div>

            <div class="detail-card">
              <h3>Key specifications</h3>
              <ul class="spec-list">
                ${product.specs
                  .map(
                    ([key, value]) => `
                      <li>
                        <span>${key}</span>
                        <strong>${value}</strong>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="container section-block">
        <div class="section-heading">
          <div>
            <h2>Related products</h2>
            <p>Continue browsing similar items in the same category.</p>
          </div>
        </div>

        <div class="catalog-grid">
          ${related.map(productCard).join("")}
        </div>
      </section>
    `
  };
}

export function cartView() {
  const items = getCartItemsDetailed();
  const subtotal = getCartSubtotal();
  const shipping = items.length ? 499 : 0;
  const total = subtotal + shipping;

  return {
    title: "NexCart — Cart",
    html: `
      <section class="container">
        <div class="section-heading">
          <div>
            <h2>Your cart</h2>
            <p>Review items, adjust quantities, and continue browsing without losing state.</p>
          </div>
        </div>

        ${
          items.length
            ? `
              <div class="cart-layout">
                <div class="cart-items">
                  ${items
                    .map(
                      (item) => `
                        <article class="cart-item">
                          <div class="cart-item-grid">
                            <div class="cart-thumb">
                              <img
                                src="${item.image}"
                                alt="${item.name}"
                                width="800"
                                height="600"
                                loading="lazy"
                              />
                            </div>

                            <div class="cart-content">
                              <p class="category-label">${categoryName(item.category)}</p>
                              <h3>${item.name}</h3>
                              <p class="card-copy">${item.short}</p>

                              <div class="cart-line">
                                <span class="price">${formatPrice(item.price)}</span>
                                <span class="muted">Line total: ${formatPrice(item.lineTotal)}</span>
                              </div>

                              <div class="cart-actions">
                                <div class="qty-controls">
                                  <button class="qty-btn" data-action="decrease-qty" data-product-id="${item.id}" type="button">−</button>
                                  <span class="qty-value">${item.qty}</span>
                                  <button class="qty-btn" data-action="increase-qty" data-product-id="${item.id}" type="button">+</button>
                                </div>

                                <button class="ghost-btn" data-action="remove-from-cart" data-product-id="${item.id}" type="button">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      `
                    )
                    .join("")}
                </div>

                <aside class="summary-card">
                  <h2>Order summary</h2>

                  <div class="cart-summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                  </div>

                  <div class="cart-summary-row">
                    <span>Shipping</span>
                    <strong>${formatPrice(shipping)}</strong>
                  </div>

                  <div class="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                  </div>

                  <button class="primary-btn" type="button">Proceed to Checkout</button>
                  <button class="ghost-btn" data-action="clear-cart" type="button">Clear Cart</button>
                </aside>
              </div>
            `
            : `
              <div class="empty-card">
                <h2>Your cart is empty</h2>
                <p class="card-copy">Add products from the catalog to start building your order.</p>
                <div class="empty-actions">
                  <a class="primary-btn" href="#/products">Browse Products</a>
                </div>
              </div>
            `
        }
      </section>
    `
  };
}

export function aboutView() {
  return {
    title: "NexCart — About",
    html: `
      <section class="container">
        <div class="section-heading">
          <div>
            <h2>About the experience</h2>
            <p>This application is structured to feel polished, modular, and deployment-ready.</p>
          </div>
        </div>

        <div class="about-grid">
          <article class="about-card">
            <h3>Modular frontend architecture</h3>
            <p class="card-copy">
              The app is split into route logic, reusable views, centralized state management, and dedicated product data modules.
            </p>
            <div class="about-tags">
              <span class="about-tag">ES Modules</span>
              <span class="about-tag">Reusable Views</span>
              <span class="about-tag">Scalable Structure</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Client-side routing</h3>
            <p class="card-copy">
              Route-based navigation keeps transitions seamless between Home, Products, Saved, Cart, and individual product pages.
            </p>
            <div class="about-tags">
              <span class="about-tag">Hash Routing</span>
              <span class="about-tag">SPA Experience</span>
              <span class="about-tag">No Full Reload</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Performance-minded assets</h3>
            <p class="card-copy">
              Product visuals are generated as lightweight inline SVGs, lazy loaded where relevant, and structured with fixed dimensions.
            </p>
            <div class="about-tags">
              <span class="about-tag">Inline SVG</span>
              <span class="about-tag">Lazy Loading</span>
              <span class="about-tag">Responsive UI</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Persistent application state</h3>
            <p class="card-copy">
              Cart and saved products persist with localStorage so the user experience remains continuous across sessions.
            </p>
            <div class="about-tags">
              <span class="about-tag">Local Storage</span>
              <span class="about-tag">State-driven UI</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Deployment-ready approach</h3>
            <p class="card-copy">
              The project is built as a static client-side app, making it easy to deploy live on Vercel or Netlify with a public URL.
            </p>
            <div class="about-tags">
              <span class="about-tag">Netlify</span>
              <span class="about-tag">Vercel</span>
              <span class="about-tag">Production Ready</span>
            </div>
          </article>

          <article class="about-card">
            <h3>User experience goals</h3>
            <p class="card-copy">
              Fast browsing, clear product comparison, simple filtering, persistent cart behavior, and a refined modern interface.
            </p>
            <div class="about-tags">
              <span class="about-tag">Catalog UX</span>
              <span class="about-tag">Shopping Flow</span>
              <span class="about-tag">Interactive UI</span>
            </div>
          </article>
        </div>
      </section>
    `
  };
}

export function notFoundView() {
  return {
    title: "NexCart — Not Found",
    html: `
      <section class="container">
        <div class="empty-card">
          <h2>Page not found</h2>
          <p class="card-copy">The route you requested does not exist. Return to the homepage or continue browsing the catalog.</p>
          <div class="empty-actions">
            <a class="primary-btn" href="#/">Go Home</a>
            <a class="secondary-btn" href="#/products">Browse Products</a>
          </div>
        </div>
      </section>
    `
  };
}