function encode(text) {
  return encodeURIComponent(text);
}

function createProductImage(title, accent, background, tag) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" rx="36" fill="${background}" />
      <circle cx="670" cy="115" r="120" fill="${accent}" fill-opacity="0.18" />
      <circle cx="170" cy="500" r="140" fill="${accent}" fill-opacity="0.10" />
      <rect x="64" y="72" width="140" height="42" rx="21" fill="${accent}" />
      <text x="134" y="100" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="#ffffff">${tag}</text>
      <text x="64" y="200" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="800" fill="#172033">${title}</text>
      <rect x="64" y="250" width="290" height="16" rx="8" fill="#d7e3f4" />
      <rect x="64" y="285" width="220" height="16" rx="8" fill="#d7e3f4" />
      <rect x="64" y="430" width="240" height="56" rx="28" fill="#ffffff" stroke="#d7e3f4" stroke-width="3" />
      <text x="184" y="466" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#172033">Premium Catalog</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encode(svg)}`;
}

export const products = [
  {
    id: 1,
    slug: "aerobeat-headphones",
    name: "AeroBeat Headphones",
    category: "audio",
    price: 12999,
    originalPrice: 14999,
    rating: 4.8,
    reviews: 184,
    badge: "Best Seller",
    badgeType: "top",
    short: "Wireless over-ear headphones with immersive sound and premium comfort.",
    description:
      "AeroBeat Headphones deliver balanced audio, soft memory-foam cushioning, and a sleek lightweight build for long listening sessions.",
    featured: true,
    image: createProductImage("AeroBeat", "#4F46E5", "#EEF2FF", "Audio"),
    specs: [
      ["Battery Life", "32 Hours"],
      ["Connectivity", "Bluetooth 5.3"],
      ["Noise Control", "Active Cancellation"],
      ["Charge Port", "USB-C"],
    ],
  },
  {
    id: 2,
    slug: "pulse-smartwatch",
    name: "Pulse Smartwatch",
    category: "wearables",
    price: 18999,
    originalPrice: 21999,
    rating: 4.6,
    reviews: 132,
    badge: "New",
    badgeType: "new",
    short: "Fitness-ready smartwatch with heart monitoring and elegant all-day styling.",
    description:
      "Pulse Smartwatch helps track activity, sleep, and wellness metrics while maintaining a minimal, premium look suitable for work and travel.",
    featured: true,
    image: createProductImage("Pulse", "#10B981", "#ECFDF5", "Wearable"),
    specs: [
      ["Display", "AMOLED"],
      ["Water Resistance", "5 ATM"],
      ["Battery Life", "10 Days"],
      ["Tracking", "Health + Sleep"],
    ],
  },
  {
    id: 3,
    slug: "atlas-keyboard",
    name: "Atlas Mechanical Keyboard",
    category: "workspace",
    price: 8999,
    originalPrice: 9999,
    rating: 4.7,
    reviews: 96,
    badge: "Top Rated",
    badgeType: "top",
    short: "Compact mechanical keyboard designed for fast typing and clean desk setups.",
    description:
      "Atlas combines tactile performance with a refined aluminum body, hot-swappable switches, and a modern minimal profile.",
    featured: true,
    image: createProductImage("Atlas", "#F59E0B", "#FFF7ED", "Workspace"),
    specs: [
      ["Layout", "75% Compact"],
      ["Switch Type", "Hot-Swappable"],
      ["Backlight", "RGB"],
      ["Frame", "Aluminum"],
    ],
  },
  {
    id: 4,
    slug: "lumina-desk-lamp",
    name: "Lumina Desk Lamp",
    category: "lighting",
    price: 5999,
    originalPrice: 7499,
    rating: 4.5,
    reviews: 74,
    badge: "Popular",
    badgeType: "hot",
    short: "Adjustable desk lighting with ambient glow modes for work and reading.",
    description:
      "Lumina creates a clean, warm workspace atmosphere with adjustable brightness, touch controls, and a space-saving sculpted base.",
    featured: true,
    image: createProductImage("Lumina", "#EC4899", "#FDF2F8", "Lighting"),
    specs: [
      ["Brightness Modes", "5 Levels"],
      ["Color Tone", "Warm + Neutral"],
      ["Control", "Touch"],
      ["Power", "USB-C"],
    ],
  },
  {
    id: 5,
    slug: "drift-speaker",
    name: "Drift Portable Speaker",
    category: "audio",
    price: 6999,
    originalPrice: 7999,
    rating: 4.4,
    reviews: 61,
    badge: "Trending",
    badgeType: "hot",
    short: "Portable speaker with punchy bass and compact travel-friendly design.",
    description:
      "Drift is built for easy carry, rich low-end sound, and reliable wireless playback for daily listening or weekend getaways.",
    featured: false,
    image: createProductImage("Drift", "#0EA5E9", "#F0F9FF", "Audio"),
    specs: [
      ["Battery", "18 Hours"],
      ["Pairing", "Bluetooth 5.2"],
      ["Water Safety", "IPX6"],
      ["Output", "360° Sound"],
    ],
  },
  {
    id: 6,
    slug: "nomad-bottle",
    name: "Nomad Smart Bottle",
    category: "travel",
    price: 3499,
    originalPrice: 4499,
    rating: 4.3,
    reviews: 48,
    badge: "Everyday",
    badgeType: "new",
    short: "Temperature-aware bottle built for everyday carry and travel convenience.",
    description:
      "Nomad helps you track drink temperature with a simple display and durable body designed for workdays, travel, and study routines.",
    featured: false,
    image: createProductImage("Nomad", "#14B8A6", "#F0FDFA", "Travel"),
    specs: [
      ["Capacity", "650 ml"],
      ["Display", "Temperature Cap"],
      ["Material", "Stainless Steel"],
      ["Insulation", "12 Hours"],
    ],
  },
  {
    id: 7,
    slug: "orbit-backpack",
    name: "Orbit Tech Backpack",
    category: "travel",
    price: 7999,
    originalPrice: 9299,
    rating: 4.7,
    reviews: 89,
    badge: "Smart Carry",
    badgeType: "top",
    short: "Structured backpack built for laptops, gadgets, and organized movement.",
    description:
      "Orbit offers multi-compartment organization, comfortable support, and clean aesthetics for college, commuting, and work travel.",
    featured: false,
    image: createProductImage("Orbit", "#7C3AED", "#F5F3FF", "Travel"),
    specs: [
      ["Laptop Sleeve", "15.6 inch"],
      ["Material", "Water Resistant"],
      ["Compartments", "8 Sections"],
      ["Use Case", "College + Travel"],
    ],
  },
  {
    id: 8,
    slug: "zen-stand",
    name: "Zen Monitor Stand",
    category: "workspace",
    price: 4299,
    originalPrice: 5199,
    rating: 4.5,
    reviews: 58,
    badge: "Desk Upgrade",
    badgeType: "new",
    short: "Minimal monitor riser that improves posture and frees up desk space.",
    description:
      "Zen Monitor Stand creates a cleaner setup with storage clearance, strong support, and a tidy visual profile for modern desks.",
    featured: false,
    image: createProductImage("Zen", "#22C55E", "#F0FDF4", "Workspace"),
    specs: [
      ["Material", "Engineered Wood"],
      ["Height", "12 cm"],
      ["Use", "Monitors + Laptops"],
      ["Style", "Minimal Setup"],
    ],
  }
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}

export function getCategories() {
  return ["all", ...new Set(products.map((product) => product.category))];
}