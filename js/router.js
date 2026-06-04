function getSegments() {
  const hash = window.location.hash || "#/";
  return hash.replace(/^#/, "").split("/").filter(Boolean);
}

export function getCurrentRoute() {
  const segments = getSegments();

  if (segments.length === 0) {
    return { name: "home" };
  }

  if (segments[0] === "products") {
    return { name: "products" };
  }

  if (segments[0] === "saved") {
    return { name: "saved" };
  }

  if (segments[0] === "cart") {
    return { name: "cart" };
  }

  if (segments[0] === "checkout") {
    return { name: "checkout" };
  }

  if (segments[0] === "about") {
    return { name: "about" };
  }

  if (segments[0] === "product" && segments[1]) {
    return { name: "product", slug: segments[1] };
  }

  return { name: "not-found" };
}

export function getActiveNavName() {
  const route = getCurrentRoute();
  if (route.name === "product") return "products";
  if (route.name === "not-found") return "";
  return route.name;
}