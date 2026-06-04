import {
  homeView,
  productsView,
  savedView,
  productDetailView,
  cartView,
  aboutView,
  notFoundView
} from "./views.js";

function parseHash() {
  const hash = window.location.hash || "#/";
  const clean = hash.replace(/^#/, "");
  const segments = clean.split("/").filter(Boolean);

  return segments;
}

export function resolveRoute() {
  const segments = parseHash();

  if (segments.length === 0) {
    return homeView();
  }

  const [route, param] = segments;

  if (route === "products") {
    return productsView();
  }

  if (route === "saved") {
    return savedView();
  }

  if (route === "product" && param) {
    return productDetailView(param);
  }

  if (route === "cart") {
    return cartView();
  }

  if (route === "about") {
    return aboutView();
  }

  return notFoundView();
}

export function getCurrentTopRoute() {
  const segments = parseHash();
  if (segments.length === 0) return "home";
  return segments[0];
}