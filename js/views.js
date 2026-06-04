function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function categoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function renderStars(rating) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function productCard(product, saved) {
  return `
    <article class="catalog-card">
      <a class="catalog-media" href="#/product/${product.slug}">
        <img
          src="${product.image}"
          alt="${product.title}"
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
        />
      </a>

      <div class="catalog-body">
        <div class="card-topline">
          <span class="badge badge--${product.badgeType}">${product.badge}</span>
          <button
            class="icon-btn ${saved ? "is-active" : ""}"
            data-action="toggle-saved"
            data-product-id="${product.id}"
            aria-label="Toggle saved"
            type="button"
          >
            ♥
          </button>
        </div>

        <p class="category-label">${categoryLabel(product.category)}</p>
        <h3><a href="#/product/${product.slug}">${product.title}</a></h3>
        <p class="card-copy">${product.short}</p>

        <div class="rating-row">
          <span class="stars">${renderStars(product.rating)}</span>
          <span>${product.rating} • ${product.ratingCount} ratings</span>
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
          <button class="secondary-btn" data-action="buy-now" data-product-id="${product.id}" type="button">
            Buy Now
          </button>
        </div>
      </div>
    </article>
  `;
}

export function renderHome({ products, savedIds, cartCount, savedCount }) {
  const featured = products.slice(0, 8);
  const gallery = products.slice(0, 3);

  return {
    title: "Zweep",
    html: `
      <section class="hero">
        <article class="hero-card">
          <div class="hero-copy">
            <span class="kicker">Modern Commerce Capstone</span>
            <h1 class="hero-title">Discover premium shopping through a <span>cleaner digital experience.</span></h1>
            <p class="hero-text">
              Zweep is a live product catalog built with real product data, modular frontend architecture,
              route-based navigation, persistent state, and a polished cart-to-checkout flow.
            </p>

            <div class="cta-row">
              <a class="primary-btn" href="#/products">Shop Now</a>
              <a class="secondary-btn" href="#/about">See Architecture</a>
            </div>
          </div>
        </article>

        <aside class="hero-card hero-visual">
          <div class="metric-grid">
            <div class="metric-card">
              <strong>20</strong>
              <span>Real products</span>
            </div>
            <div class="metric-card">
              <strong>${cartCount}</strong>
              <span>Cart items</span>
            </div>
            <div class="metric-card">
              <strong>${savedCount}</strong>
              <span>Saved products</span>
            </div>
            <div class="metric-card">
              <strong>SPA</strong>
              <span>Route-based flow</span>
            </div>
          </div>

          <div class="hero-gallery">
            ${gallery.map(product => `
              <div class="gallery-tile">
                <img
                  src="${product.image}"
                  alt="${product.title}"
                  width="400"
                  height="300"
                  loading="eager"
                  decoding="async"
                />
              </div>
            `).join("")}
          </div>
        </aside>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <h2>Featured collection</h2>
            <p>Carefully surfaced products with strong ratings, pricing, and browsing appeal.</p>
          </div>
          <a class="secondary-btn" href="#/products">Open full catalog</a>
        </div>

        <div class="catalog-grid">
          ${featured.map(product => productCard(product, savedIds.includes(product.id))).join("")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <h2>Shop by category</h2>
            <p>Move directly into the collection you want to explore.</p>
          </div>
        </div>

        <div class="category-grid">
          <button class="category-card" data-action="open-category" data-category="electronics" type="button">
            <div class="category-icon" style="background:#4f46e5;">E</div>
            <h3>Electronics</h3>
            <p class="card-copy">Connected devices, digital essentials, and everyday performance tools.</p>
          </button>

          <button class="category-card" data-action="open-category" data-category="jewelery" type="button">
            <div class="category-icon" style="background:#f59e0b;">J</div>
            <h3>Jewelery</h3>
            <p class="card-copy">Statement accessories with a polished, premium presentation.</p>
          </button>

          <button class="category-card" data-action="open-category" data-category="men's clothing" type="button">
            <div class="category-icon" style="background:#10b981;">M</div>
            <h3>Men's Clothing</h3>
            <p class="card-copy">Versatile clothing options built around comfort and daily wear.</p>
          </button>

          <button class="category-card" data-action="open-category" data-category="women's clothing" type="button">
            <div class="category-icon" style="background:#ec4899;">W</div>
            <h3>Women's Clothing</h3>
            <p class="card-copy">Refined wardrobe pieces curated for lifestyle-ready shopping.</p>
          </button>
        </div>
      </section>

      <section class="section-block">
        <div class="feature-grid">
          <article class="feature-card">
            <h3>Modular frontend architecture</h3>
            <p class="card-copy">
              Data, state, routing, and rendering are separated into clear modules for maintainability and scale.
            </p>
          </article>

          <article class="feature-card">
            <h3>Persistent shopping experience</h3>
            <p class="card-copy">
              Cart and saved items remain available across reloads through localStorage-driven state.
            </p>
          </article>

          <article class="feature-card">
            <h3>Production-ready deployment</h3>
            <p class="card-copy">
              The app is lightweight, route-driven, and ready for a live public URL on Netlify or Vercel.
            </p>
          </article>
        </div>
      </section>
    `
  };
}

export function renderProducts({ products, filters, categories, savedIds }) {
  return {
    title: "Zweep — Products",
    html: `
      <section class="catalog-page">
        <div class="section-heading">
          <div>
            <h2>Product catalog</h2>
            <p>Search, filter, and sort a live 20-product collection with a smooth browsing experience.</p>
          </div>
        </div>

        <form class="catalog-toolbar" data-form="catalog-filters">
          <div class="search-box">
            <input
              type="text"
              name="search"
              value="${filters.search}"
              placeholder="Search product name, category, or keywords..."
            />
          </div>

          <div class="select-box">
            <select name="category">
              ${categories.map(category => `
                <option value="${category}" ${filters.category === category ? "selected" : ""}>
                  ${category === "all" ? "All Categories" : categoryLabel(category)}
                </option>
              `).join("")}
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
          Showing ${products.length} product(s)
        </div>

        ${
          products.length
            ? `<div class="catalog-grid">${products.map(product => productCard(product, savedIds.includes(product.id))).join("")}</div>`
            : `
              <div class="empty-card">
                <h2>No matching products found</h2>
                <p class="card-copy">Try clearing your filters or using a broader search term.</p>
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

export function renderSaved({ products, savedIds }) {
  return {
    title: "Zweep — Saved",
    html: `
      <section class="catalog-page">
        <div class="section-heading">
          <div>
            <h2>Saved collection</h2>
            <p>Your shortlist of products remains here while you continue browsing the catalog.</p>
          </div>
        </div>

        ${
          products.length
            ? `<div class="catalog-grid">${products.map(product => productCard(product, savedIds.includes(product.id))).join("")}</div>`
            : `
              <div class="empty-card">
                <h2>No saved products yet</h2>
                <p class="card-copy">Tap the heart button on any product to save it here.</p>
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

export function renderProductDetail({ product, related, savedIds }) {
  return {
    title: `Zweep — ${product.title}`,
    html: `
      <section class="detail-page">
        <div class="inline-actions">
          <a class="ghost-btn" href="#/products">← Back to catalog</a>
        </div>

        <div class="detail-layout">
          <div class="detail-media">
            <img
              src="${product.image}"
              alt="${product.title}"
              width="600"
              height="500"
              loading="eager"
              decoding="async"
            />
          </div>

          <div class="detail-info">
            <span class="badge badge--${product.badgeType}">${product.badge}</span>
            <p class="category-label">${categoryLabel(product.category)}</p>
            <h1>${product.title}</h1>

            <div class="rating-row">
              <span class="stars">${renderStars(product.rating)}</span>
              <span>${product.rating} • ${product.ratingCount} ratings</span>
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
              <button class="secondary-btn" data-action="buy-now" data-product-id="${product.id}" type="button">
                Buy Now
              </button>
              <button class="secondary-btn" data-action="toggle-saved" data-product-id="${product.id}" type="button">
                ${savedIds.includes(product.id) ? "Remove from Saved" : "Save Product"}
              </button>
            </div>

            <div class="product-highlights">
              ${product.highlights.map(item => `<span class="highlight-chip">${item}</span>`).join("")}
            </div>

            <article class="detail-side-card">
              <h3>Product details</h3>
              <ul class="spec-list">
                <li><span>Category</span><strong>${categoryLabel(product.category)}</strong></li>
                <li><span>Rating</span><strong>${product.rating}</strong></li>
                <li><span>Ratings Count</span><strong>${product.ratingCount}</strong></li>
                <li><span>Price</span><strong>${formatPrice(product.price)}</strong></li>
              </ul>
            </article>
          </div>
        </div>

        <section class="section-block">
          <div class="section-heading">
            <div>
              <h2>Related products</h2>
              <p>Continue browsing similar items from the same category.</p>
            </div>
          </div>

          <div class="catalog-grid">
            ${related.map(item => productCard(item, savedIds.includes(item.id))).join("")}
          </div>
        </section>
      </section>
    `
  };
}

export function renderCart({ items, subtotal }) {
  const shipping = items.length ? 12 : 0;
  const total = subtotal + shipping;

  return {
    title: "Zweep — Cart",
    html: `
      <section class="cart-page">
        <div class="section-heading">
          <div>
            <h2>Your cart</h2>
            <p>Review selected items, adjust quantities, and continue toward checkout.</p>
          </div>
        </div>

        ${
          items.length
            ? `
              <div class="cart-layout">
                <div class="cart-items">
                  ${items.map(item => `
                    <article class="cart-item">
                      <div class="cart-item-grid">
                        <div class="cart-thumb">
                          <img
                            src="${item.image}"
                            alt="${item.title}"
                            width="400"
                            height="300"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div class="cart-content">
                          <p class="category-label">${categoryLabel(item.category)}</p>
                          <h3>${item.title}</h3>
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
                  `).join("")}
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

                  <a class="primary-btn" href="#/checkout">Proceed to Checkout</a>
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

export function renderCheckout({ items, subtotal, lastOrder }) {
  const shipping = items.length ? 12 : 0;
  const total = subtotal + shipping;

  if (!items.length && lastOrder) {
    return {
      title: "Zweep — Checkout",
      html: `
        <section class="checkout-page">
          <div class="empty-card">
            <div class="checkout-success">
              Order placed successfully • ${lastOrder.id}
            </div>
            <h2>Thank you for shopping with Zweep</h2>
            <p class="card-copy">
              Your order was placed for <strong>${lastOrder.customer}</strong> on ${lastOrder.placedAt}.
            </p>
            <p class="card-copy">A confirmation flow can be connected here in a future backend/payment integration phase.</p>
            <div class="empty-actions">
              <a class="primary-btn" href="#/products">Continue Shopping</a>
            </div>
          </div>
        </section>
      `
    };
  }

  return {
    title: "Zweep — Checkout",
    html: `
      <section class="checkout-page">
        <div class="section-heading">
          <div>
            <h2>Checkout</h2>
            <p>Complete your order with a clean, production-style checkout experience.</p>
          </div>
        </div>

        ${
          items.length
            ? `
              <div class="checkout-layout">
                <div class="checkout-card">
                  <h2>Shipping details</h2>

                  <form class="checkout-form" data-form="checkout-form">
                    <div class="checkout-grid">
                      <input type="text" name="fullName" placeholder="Full name" required />
                      <input type="email" name="email" placeholder="Email address" required />
                    </div>

                    <div class="checkout-grid">
                      <input type="tel" name="phone" placeholder="Phone number" required />
                      <select name="paymentMethod" required>
                        <option value="">Select payment method</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="cod">Cash on Delivery</option>
                      </select>
                    </div>

                    <input type="text" name="address" placeholder="Street address" required />
                    <div class="checkout-grid">
                      <input type="text" name="city" placeholder="City" required />
                      <input type="text" name="postalCode" placeholder="Postal code" required />
                    </div>

                    <textarea name="notes" placeholder="Order notes (optional)"></textarea>

                    <div class="checkout-actions">
                      <button class="primary-btn" type="submit">Place Order</button>
                      <a class="secondary-btn" href="#/cart">Back to Cart</a>
                    </div>
                  </form>
                </div>

                <aside class="summary-card">
                  <h2>Order summary</h2>

                  ${items.map(item => `
                    <div class="cart-summary-row">
                      <span>${item.title} × ${item.qty}</span>
                      <strong>${formatPrice(item.lineTotal)}</strong>
                    </div>
                  `).join("")}

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
                </aside>
              </div>
            `
            : `
              <div class="empty-card">
                <h2>No items available for checkout</h2>
                <p class="card-copy">Add a product to your cart or use Buy Now on a product page.</p>
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

export function renderAbout() {
  return {
    title: "Zweep — About",
    html: `
      <section class="about-page">
        <div class="section-heading">
          <div>
            <h2>Project architecture</h2>
            <p>Zweep is designed as a polished capstone that combines modular code, route-driven navigation, real data, and deployment readiness.</p>
          </div>
        </div>

        <div class="about-grid">
          <article class="about-card">
            <h3>Modular frontend structure</h3>
            <p class="card-copy">
              The app is divided into API handling, state management, routing, and rendering modules to keep the architecture clean and maintainable.
            </p>
            <div class="about-tags">
              <span class="about-tag">api.js</span>
              <span class="about-tag">store.js</span>
              <span class="about-tag">router.js</span>
              <span class="about-tag">views.js</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Client-side routing</h3>
            <p class="card-copy">
              Navigation is handled as a single-page application through route-based rendering of Home, Products, Product Detail, Saved, Cart, and Checkout.
            </p>
            <div class="about-tags">
              <span class="about-tag">SPA</span>
              <span class="about-tag">Hash Routes</span>
              <span class="about-tag">Seamless Navigation</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Real product data</h3>
            <p class="card-copy">
              The catalog uses 20 real products, descriptions, ratings, prices, and images fetched from a public API for realistic presentation.
            </p>
            <div class="about-tags">
              <span class="about-tag">20 Products</span>
              <span class="about-tag">Real Images</span>
              <span class="about-tag">Live API Data</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Persistent state</h3>
            <p class="card-copy">
              Cart, saved items, and filter state are stored in localStorage so the experience remains consistent across browser reloads.
            </p>
            <div class="about-tags">
              <span class="about-tag">Cart</span>
              <span class="about-tag">Saved</span>
              <span class="about-tag">Filters</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Performance optimization</h3>
            <p class="card-copy">
              API results are cached in sessionStorage, images are lazy-loaded where appropriate, and the app stays lightweight for deployment.
            </p>
            <div class="about-tags">
              <span class="about-tag">Session Cache</span>
              <span class="about-tag">Lazy Loading</span>
              <span class="about-tag">Optimized Flow</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Deployment ready</h3>
            <p class="card-copy">
              The app is suitable for Vercel or Netlify deployment and can be shared publicly as a polished frontend capstone project.
            </p>
            <div class="about-tags">
              <span class="about-tag">Netlify</span>
              <span class="about-tag">Vercel</span>
              <span class="about-tag">Public URL</span>
            </div>
          </article>
        </div>
      </section>
    `
  };
}

export function renderNotFound() {
  return {
    title: "Zweep — Not Found",
    html: `
      <section class="catalog-page">
        <div class="empty-card">
          <h2>Page not found</h2>
          <p class="card-copy">The route you requested does not exist. Return home or continue browsing the catalog.</p>
          <div class="empty-actions">
            <a class="primary-btn" href="#/">Go Home</a>
            <a class="secondary-btn" href="#/products">Browse Products</a>
          </div>
        </div>
      </section>
    `
  };
}