import { fetchProducts } from "./api.js";
import {
  subscribe,
  setProducts,
  getState,
  getCategories,
  getFilteredProducts,
  getSavedProducts,
  getSavedCount,
  getCartCount,
  getProductBySlug,
  getRelatedProducts,
  getCartItems,
  getCartSubtotal,
  actions
} from "./store.js";
import { getCurrentRoute, getActiveNavName } from "./router.js";
import {
  renderHome,
  renderProducts,
  renderSaved,
  renderProductDetail,
  renderCart,
  renderCheckout,
  renderAbout,
  renderNotFound
} from "./views.js";

const appRoot = document.getElementById("app");
const savedCountEl = document.getElementById("saved-count");
const cartCountEl = document.getElementById("cart-count");
const toastEl = document.getElementById("toast");

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2200);
}

window.addEventListener("zweep:toast", (event) => {
  showToast(event.detail);
});

function updateHeader() {
  savedCountEl.textContent = getSavedCount();
  cartCountEl.textContent = getCartCount();

  const active = getActiveNavName();
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === active);
  });
}

function render() {
  const route = getCurrentRoute();
  const state = getState();
  let view;

  if (route.name === "home") {
    view = renderHome({
      products: state.products,
      savedIds: state.saved,
      cartCount: getCartCount(),
      savedCount: getSavedCount()
    });
  } else if (route.name === "products") {
    view = renderProducts({
      products: getFilteredProducts(),
      filters: state.filters,
      categories: getCategories(),
      savedIds: state.saved
    });
  } else if (route.name === "saved") {
    view = renderSaved({
      products: getSavedProducts(),
      savedIds: state.saved
    });
  } else if (route.name === "product") {
    const product = getProductBySlug(route.slug);
    view = product
      ? renderProductDetail({
          product,
          related: getRelatedProducts(product),
          savedIds: state.saved
        })
      : renderNotFound();
  } else if (route.name === "cart") {
    view = renderCart({
      items: getCartItems(),
      subtotal: getCartSubtotal()
    });
  } else if (route.name === "checkout") {
    view = renderCheckout({
      items: getCartItems(),
      subtotal: getCartSubtotal(),
      lastOrder: state.lastOrder
    });
  } else if (route.name === "about") {
    view = renderAbout();
  } else {
    view = renderNotFound();
  }

  document.title = view.title;
  appRoot.innerHTML = view.html;
  updateHeader();
}

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

subscribe(() => {
  render();
});

appRoot.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;

  const { action, productId, category } = actionEl.dataset;

  if (action === "add-to-cart") actions.addToCart(productId);
  if (action === "buy-now") actions.buyNow(productId);
  if (action === "toggle-saved") actions.toggleSaved(productId);
  if (action === "increase-qty") actions.increaseQty(productId);
  if (action === "decrease-qty") actions.decreaseQty(productId);
  if (action === "remove-from-cart") actions.removeFromCart(productId);
  if (action === "clear-cart") actions.clearCart();
  if (action === "reset-filters") actions.resetFilters();
  if (action === "open-category") actions.openCategory(category);
});

appRoot.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;

  event.preventDefault();

  if (form.dataset.form === "catalog-filters") {
    const formData = new FormData(form);

    actions.setFilters({
      search: formData.get("search")?.toString() || "",
      category: formData.get("category")?.toString() || "all",
      sort: formData.get("sort")?.toString() || "featured"
    });
  }

  if (form.dataset.form === "checkout-form") {
    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      paymentMethod: formData.get("paymentMethod")?.toString().trim(),
      address: formData.get("address")?.toString().trim(),
      city: formData.get("city")?.toString().trim(),
      postalCode: formData.get("postalCode")?.toString().trim(),
      notes: formData.get("notes")?.toString().trim()
    };

    if (!payload.fullName || !payload.email || !payload.phone || !payload.paymentMethod || !payload.address || !payload.city || !payload.postalCode) {
      showToast("Please complete all required checkout fields");
      return;
    }

    try {
      actions.placeOrder(payload);
      window.location.hash = "#/checkout";
    } catch (error) {
      showToast(error.message);
    }
  }
});

async function boot() {
  appRoot.innerHTML = `
    <section class="catalog-page">
      <div class="empty-card">
        <h2>Loading Zweep...</h2>
        <p class="card-copy">Preparing product catalog and storefront.</p>
      </div>
    </section>
  `;

  try {
    const products = await fetchProducts();
    setProducts(products);
    render();
  } catch (error) {
    appRoot.innerHTML = `
      <section class="catalog-page">
        <div class="empty-card">
          <h2>Unable to load catalog</h2>
          <p class="card-copy">${error.message}</p>
          <div class="hero-actions">
            <button class="primary-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </div>
      </section>
    `;
  }
}

boot();