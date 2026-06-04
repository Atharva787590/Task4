import { products, getProductById } from "./data/products.js";

const STORAGE_KEY = "task4-nexcart-store";

const listeners = [];

const defaultState = {
  cart: [],
  favorites: [],
  filters: {
    search: "",
    category: "all",
    sort: "featured"
  }
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(defaultState);

    const parsed = JSON.parse(saved);
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      filters: {
        ...defaultState.filters,
        ...(parsed.filters || {})
      }
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

const state = loadState();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function notify() {
  persist();
  listeners.forEach((listener) => listener(getState()));
}

function toast(message) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
}

export function getState() {
  return {
    cart: [...state.cart],
    favorites: [...state.favorites],
    filters: { ...state.filters }
  };
}

export function subscribe(listener) {
  listeners.push(listener);
}

export function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

export function getFavoritesCount() {
  return state.favorites.length;
}

export function isFavorite(productId) {
  return state.favorites.includes(Number(productId));
}

export function getCartItemsDetailed() {
  return state.cart
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;

      return {
        ...product,
        qty: item.qty,
        lineTotal: product.price * item.qty
      };
    })
    .filter(Boolean);
}

export function getCartSubtotal() {
  return getCartItemsDetailed().reduce((sum, item) => sum + item.lineTotal, 0);
}

export function getSavedProducts() {
  return products.filter((product) => state.favorites.includes(product.id));
}

export function getFilteredProducts() {
  let filtered = [...products];
  const { search, category, sort } = state.filters;

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.short.toLowerCase().includes(query)
    );
  }

  if (category !== "all") {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }

  return filtered;
}

export const actions = {
  addToCart(productId) {
    const id = Number(productId);
    const existing = state.cart.find((item) => item.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id, qty: 1 });
    }

    notify();
    const product = getProductById(id);
    toast(`${product?.name || "Product"} added to cart`);
  },

  removeFromCart(productId) {
    const id = Number(productId);
    state.cart = state.cart.filter((item) => item.id !== id);
    notify();
    toast("Item removed from cart");
  },

  increaseQty(productId) {
    const item = state.cart.find((entry) => entry.id === Number(productId));
    if (!item) return;
    item.qty += 1;
    notify();
  },

  decreaseQty(productId) {
    const item = state.cart.find((entry) => entry.id === Number(productId));
    if (!item) return;

    item.qty -= 1;

    if (item.qty <= 0) {
      state.cart = state.cart.filter((entry) => entry.id !== Number(productId));
    }

    notify();
  },

  clearCart() {
    state.cart = [];
    notify();
    toast("Cart cleared");
  },

  toggleFavorite(productId) {
    const id = Number(productId);
    const exists = state.favorites.includes(id);

    if (exists) {
      state.favorites = state.favorites.filter((entry) => entry !== id);
      toast("Removed from saved");
    } else {
      state.favorites.push(id);
      toast("Added to saved");
    }

    notify();
  },

  setFilters(nextFilters) {
    state.filters = {
      ...state.filters,
      ...nextFilters
    };
    notify();
  },

  resetFilters() {
    state.filters = {
      search: "",
      category: "all",
      sort: "featured"
    };
    notify();
  },

  setCategoryAndOpenProducts(category) {
    state.filters = {
      ...state.filters,
      category,
      search: ""
    };
    notify();
    window.location.hash = "#/products";
  }
};