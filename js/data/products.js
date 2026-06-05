function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBadge(item) {
  if (item.rating.rate >= 4.7) return { text: "Top Rated", type: "top" };
  if (item.price >= 100) return { text: "Popular", type: "hot" };
  return { text: "New", type: "new" };
}

function getHighlights(category) {
  const map = {
    electronics: ["Smart Choice", "Daily Utility", "Performance Ready"],
    jewelery: ["Premium Finish", "Refined Style", "Gift Worthy"],
    "men's clothing": ["Everyday Wear", "Comfort Fit", "Casual Ready"],
    "women's clothing": ["Lifestyle Pick", "Modern Fit", "Easy Styling"]
  };
  return map[category] || ["Curated Product", "Reliable Choice", "Catalog Favorite"];
}

const rawProducts = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop up to 15 inches in the padded sleeve and carry your daily essentials comfortably.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    rating: { rate: 3.9, count: 120 }
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim-fitting casual shirt with contrast raglan long sleeve styling, soft fabric, and a breathable comfortable feel for daily wear.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    rating: { rate: 4.1, count: 259 }
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "A versatile outerwear jacket ideal for cooler weather, travel, hiking, and casual urban layering.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    rating: { rate: 4.7, count: 500 }
  },
  {
    id: 4,
    title: "Mens Casual Slim Fit",
    price: 15.99,
    description: "A simple slim-fit casual wear essential made for everyday use and clean styling.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
    rating: { rate: 2.1, count: 430 }
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description: "An elegant bracelet from the Legends Collection inspired by the mythical water dragon with refined premium detailing.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    rating: { rate: 4.6, count: 400 }
  },
  {
    id: 6,
    title: "Solid Gold Petite Micropave",
    price: 168,
    description: "A sleek jewelry piece with subtle luxury appeal and a strong premium gift-ready look.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
    rating: { rate: 3.9, count: 70 }
  },
  {
    id: 7,
    title: "White Gold Plated Princess",
    price: 9.99,
    description: "Classic engagement-inspired ring with a polished white-gold-plated finish and timeless styling.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
    rating: { rate: 3.0, count: 400 }
  },
  {
    id: 8,
    title: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    price: 10.99,
    description: "Rose gold plated stainless steel earrings with a strong modern look and lightweight presence.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
    rating: { rate: 1.9, count: 100 }
  },
  {
    id: 9,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    description: "Portable hard drive with fast transfer speeds, simple plug-and-play setup, and dependable everyday backup support.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
    rating: { rate: 3.3, count: 203 }
  },
  {
    id: 10,
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 109,
    description: "A performance-focused internal SSD designed to improve application loading and system responsiveness.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
    rating: { rate: 2.9, count: 470 }
  },
  {
    id: 11,
    title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
    price: 109,
    description: "An efficient SSD built to increase speed, boost reliability, and improve overall system performance.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
    rating: { rate: 4.8, count: 319 }
  },
  {
    id: 12,
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    price: 114,
    description: "A high-capacity gaming drive designed to expand storage and make game access more flexible.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
    rating: { rate: 4.8, count: 400 }
  },
  {
    id: 13,
    title: "Acer SB220Q bi 21.5 inches Full HD IPS Ultra-Thin Monitor",
    price: 599,
    description: "A clean full HD IPS monitor with sleek proportions and productivity-focused screen performance.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
    rating: { rate: 2.9, count: 250 }
  },
  {
    id: 14,
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
    price: 999.99,
    description: "A super ultrawide gaming monitor built for immersive visuals, high refresh rate gaming, and premium display performance.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    rating: { rate: 2.2, count: 140 }
  },
  {
    id: 15,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    price: 56.99,
    description: "A versatile winter jacket with detachable liner and adjustable hood for changing weather conditions.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
    rating: { rate: 2.6, count: 235 }
  },
  {
    id: 16,
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description: "A moto-inspired faux leather jacket with removable hood and bold everyday styling.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
    rating: { rate: 2.9, count: 340 }
  },
  {
    id: 17,
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description: "A lightweight windbreaker rain jacket made for casual wear, travel, and outdoor weather support.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
    rating: { rate: 3.8, count: 679 }
  },
  {
    id: 18,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description: "A soft and stretch-friendly women’s top designed for simple daily comfort and easy styling.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    rating: { rate: 4.7, count: 130 }
  },
  {
    id: 19,
    title: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description: "A breathable moisture-wicking top designed for comfort, movement, and active casual wear.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
    rating: { rate: 4.5, count: 146 }
  },
  {
    id: 20,
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description: "A casual cotton-blend t-shirt with a clean everyday look and seasonal versatility.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
    rating: { rate: 3.6, count: 145 }
  }
];

export const products = rawProducts.map((item) => {
  const badge = getBadge(item);

  return {
    ...item,
    slug: slugify(item.title),
    short: item.description.length > 110 ? `${item.description.slice(0, 107)}...` : item.description,
    originalPrice: Number((item.price * 1.18).toFixed(2)),
    badge: badge.text,
    badgeType: badge.type,
    highlights: getHighlights(item.category)
  };
});