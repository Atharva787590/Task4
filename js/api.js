const API_URL = "https://fakestoreapi.com/products";
const CACHE_KEY = "task4-zweep-products-cache-v1";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBadge(product) {
  if (product.rating?.rate >= 4.7) {
    return { text: "Top Rated", type: "top" };
  }

  if (product.price >= 100) {
    return { text: "Popular", type: "hot" };
  }

  return { text: "New", type: "new" };
}

function getHighlights(category) {
  const map = {
    electronics: ["Smart choice", "Daily utility", "Performance-ready"],
    jewelery: ["Premium look", "Refined finish", "Gift-ready"],
    "men's clothing": ["Everyday wear", "Easy styling", "Comfort fit"],
    "women's clothing": ["Curated style", "Modern fit", "Lifestyle ready"]
  };

  return map[category] || ["Catalog pick", "Reliable choice", "Well reviewed"];
}

function normalizeProduct(item) {
  const badge = getBadge(item);

  return {
    id: item.id,
    slug: slugify(item.title),
    title: item.title,
    description: item.description,
    short: item.description.length > 110 ? `${item.description.slice(0, 107)}...` : item.description,
    price: item.price,
    originalPrice: Number((item.price * 1.18).toFixed(2)),
    category: item.category,
    image: item.image,
    rating: item.rating?.rate ?? 0,
    ratingCount: item.rating?.count ?? 0,
    badge: badge.text,
    badgeType: badge.type,
    highlights: getHighlights(item.category)
  };
}

export async function fetchProducts() {
  const cached = sessionStorage.getItem(CACHE_KEY);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      sessionStorage.removeItem(CACHE_KEY);
    }
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch product catalog. Please check your connection and try again.");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected product response received from the API.");
  }

  const normalized = data.map(normalizeProduct);
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
  return normalized;
}