// src/utils/categoryMap.js

// Each object has the display name (exactly as stored in your Firebase `category` array) and a URL‐friendly slug.
export const CATEGORY_MAP = [
  { name: "National", slug: "national" },
  { name: "Math & Science", slug: "math_science" },
  { name: "Debate", slug: "debate" },
  { name: "Cultural & Language", slug: "cultural_language" },
  { name: "Programming", slug: "programming" },
  { name : "Competitive Programming", slug: "competitive_programming"},
  { name: "Technology", slug: "technology" },
  { name: "Sports", slug: "sports" },
  { name: "Miscellaneous", slug: "miscellaneous" },
];

// A helper to look up a “slug” → “display name”
export function getCategoryNameFromSlug(slug) {
  const found = CATEGORY_MAP.find((c) => c.slug === slug);
  return found ? found.name : null;
}

// A helper to list all slugs (for building Navbar links, etc.)
export const ALL_CATEGORY_SLUGS = CATEGORY_MAP.map((c) => c.slug);
