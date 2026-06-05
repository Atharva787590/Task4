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
        <article class="hero-box hero-main">
          <span class="kicker">Neo-Brutalist Commerce</span>
          <h1 class="hero-title">Discover premium products through a <span>bold shopping experience.</span></h1>
          <p class="hero-text">
            Zweep is a modular e-commerce catalog built for real product discovery, route-based browsing,
            persistent cart state, and a strong visual identity.
          </p>

          <div class="hero-actions">
            <a class="primary-btn" href="#/products">Shop Now</a>
            <a class="secondary-btn" href="#/about">Project Architecture</a>
          </div>
        </article>

        <aside class="hero-side">
          <div class="hero-stats">
            <div class="stat-box"><strong>20</strong><span>Products</span></div>
            <div class="stat-box"><strong>${cartCount}</strong><span>Cart Items</span></div>
            <div class="stat-box"><strong>${savedCount}</strong><span>Saved Items</span></div>
          </div>

          <div class="hero-gallery">
            ${gallery.map(product => `
              <div class="gallery-tile">
                <img src="${product.image}" alt="${product.title}" width="400" height="300" />
              </div>
            `).join("")}
          </div>
        </aside>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <h2>Featured collection</h2>
            <p>Real products, real images, and a sharper browsing flow.</p>
          </div>
          <a class="secondary-btn" href="#/products">View all</a>
        </div>

        <div class="catalog-grid">
          ${featured.map(product => productCard(product, savedIds.includes(product.id))).join("")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <h2>Shop by category</h2>
            <p>Jump directly into your preferred product type.</p>
          </div>
        </div>

        <div class="category-grid">
          <button class="category-card" data-action="open-category" data-category="electronics" type="button">
            <div class="category-icon" style="background:#4f46e5;">E</div>
            <h3>Electronics</h3>
            <p class="card-copy">Digital devices and performance-ready essentials.</p>
          </button>

          <button class="category-card" data-action="open-category" data-category="jewelery" type="button">
            <div class="category-icon" style="background:#ffd93d;">J</div>
            <h3>Jewelery</h3>
            <p class="card-copy">Statement pieces with premium finish and visual appeal.</p>
          </button>

          <button class="category-card" data-action="open-category" data-category="men's clothing" type="button">
            <div class="category-icon" style="background:#7ed957;">M</div>
            <h3>Men's Clothing</h3>
            <p class="card-copy">Comfort-driven and everyday-ready styles.</p>
          </button>

          <button class="category-card" data-action="open-category" data-category="women's clothing" type="button">
            <div class="category-icon" style="background:#ff6b6b;">W</div>
            <h3>Women's Clothing</h3>
            <p class="card-copy">Curated lifestyle picks for stylish daily wear.</p>
          </button>
        </div>
      </section>

      <section class="section-block">
        <div class="feature-grid">
          <article class="feature-card">
            <h3>Modular Architecture</h3>
            <p class="card-copy">
              The app is split into data, API, store, router, views, and app logic for maintainability and clean architecture.
            </p>
          </article>

          <article class="feature-card">
            <h3>Client-Side Routing</h3>
            <p class="card-copy">
              Navigation remains smooth between Home, Products, Product Detail, Saved, Cart, and Checkout.
            </p>
          </article>

          <article class="feature-card">
            <h3>Production Ready</h3>
            <p class="card-copy">
              Persistent state, route flow, optimized loading, and deployment-ready structure make this a strong capstone.
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
            <h2>Products</h2>
            <p>Search, filter, sort, and browse all products in one clean route.</p>
          </div>
        </div>

        <form class="catalog-toolbar" data-form="catalog-filters">
          <div class="filter-row">
            <div class="search-box">
              <input
                type="text"
                name="search"
                value="${filters.search}"
                placeholder="Search product name, category, or keyword..."
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
          </div>
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
                <p class="card-copy">Try a broader search term or reset the filters.</p>
                <div class="hero-actions">
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
            <h2>Saved</h2>
            <p>Your wishlist stays here while you continue exploring products.</p>
          </div>
        </div>

        ${
          products.length
            ? `<div class="catalog-grid">${products.map(product => productCard(product, savedIds.includes(product.id))).join("")}</div>`
            : `
              <div class="empty-card">
                <h2>No saved items yet</h2>
                <p class="card-copy">Tap the heart button on any product card to add it here.</p>
                <div class="hero-actions">
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
        <div class="hero-actions">
          <a class="ghost-btn" href="#/products">← Back to products</a>
        </div>

        <div class="detail-layout">
          <div class="detail-media">
            <img src="${product.image}" alt="${product.title}" width="600" height="500" />
          </div>

          <div class="info-card detail-info">
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

            <div class="hero-actions">
              <button class="primary-btn" data-action="add-to-cart" data-product-id="${product.id}" type="button">
                Add to Cart
              </button>
              <button class="secondary-btn" data-action="buy-now" data-product-id="${product.id}" type="button">
                Buy Now
              </button>
              <button class="ghost-btn" data-action="toggle-saved" data-product-id="${product.id}" type="button">
                ${savedIds.includes(product.id) ? "Remove Saved" : "Save Product"}
              </button>
            </div>

            <div class="tag-row">
              ${product.highlights.map(item => `<span class="highlight-chip">${item}</span>`).join("")}
            </div>

            <div class="detail-side-card">
              <h3>Product Details</h3>
              <ul class="spec-list">
                <li><span>Category</span><strong>${categoryLabel(product.category)}</strong></li>
                <li><span>Rating</span><strong>${product.rating}</strong></li>
                <li><span>Reviews</span><strong>${product.ratingCount}</strong></li>
                <li><span>Price</span><strong>${formatPrice(product.price)}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <section class="section-block">
          <div class="section-heading">
            <div>
              <h2>Related Products</h2>
              <p>Continue shopping with similar products from the same category.</p>
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
            <h2>Cart</h2>
            <p>Review products, update quantity, and move to checkout.</p>
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
                          <img src="${item.image}" alt="${item.title}" width="400" height="300" />
                        </div>

                        <div class="cart-content">
                          <p class="category-label">${categoryLabel(item.category)}</p>
                          <h3>${item.title}</h3>
                          <p class="card-copy">${item.short}</p>

                          <div class="cart-line">
                            <span class="price">${formatPrice(item.price)}</span>
                            <span>Line Total: ${formatPrice(item.lineTotal)}</span>
                          </div>

                          <div class="hero-actions">
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
                  <h2>Summary</h2>

                  <div class="summary-line">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                  </div>
                  <div class="summary-line">
                    <span>Shipping</span>
                    <strong>${formatPrice(shipping)}</strong>
                  </div>
                  <div class="summary-line">
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
                <p class="card-copy">Add products to the cart to continue your shopping flow.</p>
                <div class="hero-actions">
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
            <div class="hero-actions">
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
            <p>Complete your order with a structured and polished checkout flow.</p>
          </div>
        </div>

        ${
          items.length
            ? `
              <div class="checkout-layout">
                <div class="checkout-card">
                  <h2>Shipping Details</h2>

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
                  <h2>Order Summary</h2>

                  ${items.map(item => `
                    <div class="summary-line">
                      <span>${item.title} × ${item.qty}</span>
                      <strong>${formatPrice(item.lineTotal)}</strong>
                    </div>
                  `).join("")}

                  <div class="summary-line">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                  </div>
                  <div class="summary-line">
                    <span>Shipping</span>
                    <strong>${formatPrice(shipping)}</strong>
                  </div>
                  <div class="summary-line">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                  </div>
                </aside>
              </div>
            `
            : `
              <div class="empty-card">
                <h2>No items available for checkout</h2>
                <p class="card-copy">Use Add to Cart or Buy Now on a product to continue.</p>
                <div class="hero-actions">
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
            <h2>Project Architecture</h2>
            <p>Zweep combines modular code, client-side routing, real product data, and deployment readiness.</p>
          </div>
        </div>

        <div class="about-grid">
          <article class="about-card">
            <h3>Modular Frontend</h3>
            <p class="card-copy">
              Data, API, store, router, views, and app boot logic are separated cleanly for maintainability.
            </p>
            <div class="tag-row">
              <span class="about-tag">api.js</span>
              <span class="about-tag">store.js</span>
              <span class="about-tag">router.js</span>
              <span class="about-tag">views.js</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Client-Side Routing</h3>
            <p class="card-copy">
              Users can move through Home, Products, Product Detail, Saved, Cart, Checkout, and About without page reloads.
            </p>
            <div class="tag-row">
              <span class="about-tag">SPA</span>
              <span class="about-tag">Route Flow</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Persistent State</h3>
            <p class="card-copy">
              Cart and saved products are stored in localStorage, making the shopping experience persistent across refreshes.
            </p>
            <div class="tag-row">
              <span class="about-tag">Cart State</span>
              <span class="about-tag">Saved State</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Real Product Catalog</h3>
            <p class="card-copy">
              The app contains 20 real products with actual image URLs, pricing, category data, and descriptions.
            </p>
            <div class="tag-row">
              <span class="about-tag">20 Products</span>
              <span class="about-tag">Real Images</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Deploy Ready</h3>
            <p class="card-copy">
              As a static route-driven frontend app, Zweep can be deployed directly to Netlify or Vercel.
            </p>
            <div class="tag-row">
              <span class="about-tag">Netlify</span>
              <span class="about-tag">Vercel</span>
            </div>
          </article>

          <article class="about-card">
            <h3>Capstone Goals</h3>
            <p class="card-copy">
              This project demonstrates frontend structure, route handling, interactive shopping flow, and professional-grade delivery.
            </p>
            <div class="tag-row">
              <span class="about-tag">Frontend Architecture</span>
              <span class="about-tag">Production Mindset</span>
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
          <p class="card-copy">The route you requested does not exist.</p>
          <div class="hero-actions">
            <a class="primary-btn" href="#/">Go Home</a>
            <a class="secondary-btn" href="#/products">Browse Products</a>
          </div>
        </div>
      </section>
    `
  };
}