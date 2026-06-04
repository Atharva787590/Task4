import { resolveRoute, getCurrentTopRoute } from "./router.js";
import {
  subscribe,
  actions,
  getCartCount,
  getFavoritesCount
} from "./store.js";

const appRoot = document.getElementById("app");
const cartCountEl = document.getElementById("cart-count");
const savedCountEl = document.getElementById("saved-count");
const toastEl = document.getElementById("toast");

function updateHeaderCounts() {
  cartCountEl.textContent = getCartCount();
  savedCountEl.textContent = getFavoritesCount();
}

function updateActiveNav() {
  const current = getCurrentTopRoute();
  const navLinks = document.querySelectorAll("[data-nav]");

  navLinks.forEach((link) => {
    const route = link.dataset.nav;
    const active =
      (current === "home" && route === "home") ||
      (current !== "home" && current === route);

    link.classList.toggle("is-active", active);
  });
}

function render() {
  const view = resolveRoute();
  document.title = view.title;
  appRoot.innerHTML = view.html;
  updateHeaderCounts();
  updateActiveNav();
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2200);
}

window.addEventListener("app:toast", (event) => {
  showToast(event.detail);
});

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

  if (action === "add-to-cart") {
    actions.addToCart(productId);
  }

  if (action === "toggle-favorite") {
    actions.toggleFavorite(productId);
  }

  if (action === "increase-qty") {
    actions.increaseQty(productId);
  }

  if (action === "decrease-qty") {
    actions.decreaseQty(productId);
  }

  if (action === "remove-from-cart") {
    actions.removeFromCart(productId);
  }

  if (action === "clear-cart") {
    actions.clearCart();
  }

  if (action === "reset-filters") {
    actions.resetFilters();
  }

  if (action === "jump-category") {
    actions.setCategoryAndOpenProducts(category);
  }
});

appRoot.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;

  event.preventDefault();

  if (form.dataset.form === "catalog-search") {
    const formData = new FormData(form);
    actions.setFilters({
      search: formData.get("search")?.toString() || "",
      category: formData.get("category")?.toString() || "all",
      sort: formData.get("sort")?.toString() || "featured"
    });
  }
});

render();