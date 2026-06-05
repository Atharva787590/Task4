const STORAGE_KEY = "task4-zweep-store";
const listeners = [];

function readStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        cart: [],
        saved: [],
        filters: {
          search: "",
          category: "all",
          sort: "featured"
        },
        lastOrder: null
      };
    }

    const parsed = JSON.parse(saved);

    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      filters: {
        search: parsed.filters?.search || "",
        category: parsed.filters?.category || "all",
        sort: parsed.filters?.sort || "featured"
      },
      lastOrder: parsed.lastOrder || null
    };
  } catch (error) {
    return {
      cart: [],
      saved: [],
      filters: {
        search: "",
        category: "all",
        sort: "featured"
      },
      lastOrder: null
    };
  }
}

const base = readStorage();

const state = {
  products: [],
  cart: base.cart,
  saved: base.saved,
  filters: base.filters,
  lastOrder: base.lastOrder
};

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      cart: state.cart,
      saved: state.saved,
      filters: state.filters,
      lastOrder: state.lastOrder
    })
  );
}

function notify() {
  persist();
  listeners.forEach((listener) => listener(getState()));
}

function toast(message) {
  window.dispatchEvent(new CustomEvent("zweep:toast", { detail: message }));
}

export function subscribe(listener) {
  listeners.push(listener);
}

export function setProducts(products) {
  state.products = products;
  notify();
}

export function getState() {
  return {
    products: [...state.products],
    cart: [...state.cart],
    saved: [...state.saved],
    filters: { ...state.filters },
    lastOrder: state.lastOrder
  };
}

export function getCategories() {
  return ["all", ...new Set(state.products.map((product) => product.category))];
}

export function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

export function getSavedCount() {
  return state.saved.length;
}

export function isSaved(productId) {
  return state.saved.includes(Number(productId));
}

export function getFilteredProducts() {
  const { search, category, sort } = state.filters;
  let items = [...state.products];

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    items = items.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  if (category !== "all") {
    items = items.filter((product) => product.category === category);
  }

  if (sort === "price-asc") {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    items.sort((a, b) => b.rating - a.rating);
  } else {
    items.sort((a, b) => {
      if (a.rating === b.rating) return b.ratingCount - a.ratingCount;
      return b.rating - a.rating;
    });
  }

  return items;
}

export function getProductBySlug(slug) {
  return state.products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product) {
  return state.products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);
}

export function getSavedProducts() {
  return state.products.filter((product) => state.saved.includes(product.id));
}

export function getCartItems() {
  return state.cart
    .map((entry) => {
      const product = state.products.find((item) => item.id === entry.id);
      if (!product) return null;

      return {
        ...product,
        qty: entry.qty,
        lineTotal: Number((product.price * entry.qty).toFixed(2))
      };
    })
    .filter(Boolean);
}

export function getCartSubtotal() {
  return getCartItems().reduce((sum, item) => sum + item.lineTotal, 0);
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
    const product = state.products.find((item) => item.id === id);
    toast(`${product?.title || "Product"} added to cart`);
  },

  buyNow(productId) {
    const id = Number(productId);
    state.cart = [{ id, qty: 1 }];
    notify();

    const product = state.products.find((item) => item.id === id);
    toast(`${product?.title || "Product"} ready for checkout`);
    window.location.hash = "#/checkout";
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

  toggleSaved(productId) {
    const id = Number(productId);
    const exists = state.saved.includes(id);

    if (exists) {
      state.saved = state.saved.filter((entry) => entry !== id);
      toast("Removed from saved");
    } else {
      state.saved.push(id);
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

  openCategory(category) {
    state.filters = {
      ...state.filters,
      search: "",
      category,
      sort: "featured"
    };
    notify();
    window.location.hash = "#/products";
  },

  placeOrder(formData) {
    const items = getCartItems();
    if (!items.length) {
      throw new Error("Your cart is empty.");
    }

    const orderId = `ZW-${Date.now()}`;
    state.lastOrder = {
      id: orderId,
      customer: formData.fullName,
      email: formData.email,
      total: getCartSubtotal(),
      placedAt: new Date().toLocaleString()
    };

    state.cart = [];
    notify();
    toast("Order placed successfully");
    return state.lastOrder;
  }
};