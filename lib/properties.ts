import { PROPERTIES_DATA } from "@/data/properties";
import type { Property, PropertiesResponse } from "@/types/property";
import { PAGE_SIZE, type PropertyQuery } from "@/lib/schema/query";

// The one place that reads property data. The API routes, the listings/detail pages and the
// landing's featured homes all call these functions, so they can never disagree.

const SIMILAR_COUNT = 4;

export function searchProperties(query: PropertyQuery, limit = PAGE_SIZE): PropertiesResponse {
  const term = query.q.trim().toLowerCase();

  const matches = PROPERTIES_DATA.filter((property) => {
    if (term) {
      const haystack = `${property.title} ${property.locality} ${property.city}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (query.minPrice !== undefined && property.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && property.price > query.maxPrice) return false;
    if (query.bhk.length > 0 && !query.bhk.includes(property.bhk)) return false;
    if (query.type.length > 0 && !query.type.includes(property.type)) return false;
    if (query.furnished !== undefined && property.furnished !== query.furnished) return false;
    return true;
  });

  // Ties are broken by id so the order (and therefore pagination) is stable between requests.
  matches.sort((a, b) => {
    const difference =
      query.sort === "price_asc"
        ? a.price - b.price
        : query.sort === "price_desc"
          ? b.price - a.price
          : b.createdAt.localeCompare(a.createdAt);
    return difference !== 0 ? difference : a.id.localeCompare(b.id);
  });

  const start = (query.page - 1) * limit;
  return {
    items: matches.slice(start, start + limit),
    total: matches.length,
    page: query.page,
    hasMore: start + limit < matches.length,
  };
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES_DATA.find((property) => property.slug === slug);
}

export function getAllSlugs(): string[] {
  return PROPERTIES_DATA.map((property) => property.slug);
}

export function getFeaturedProperties(count: number): Property[] {
  return PROPERTIES_DATA.filter((property) => property.featured).slice(0, count);
}

/** Same locality first, then same BHK, then closest in price. Never includes the home itself. */
export function getSimilarProperties(current: Property, count = SIMILAR_COUNT): Property[] {
  const score = (property: Property) =>
    (property.locality === current.locality ? 2 : 0) + (property.bhk === current.bhk ? 1 : 0);

  return PROPERTIES_DATA.filter((property) => property.slug !== current.slug)
    .sort((a, b) => {
      const byScore = score(b) - score(a);
      if (byScore !== 0) return byScore;
      return Math.abs(a.price - current.price) - Math.abs(b.price - current.price);
    })
    .slice(0, count);
}

/** Headline numbers for the landing (computed, so they never drift from the data). */
export function getPortfolioStats() {
  return {
    homes: PROPERTIES_DATA.length,
    cities: new Set(PROPERTIES_DATA.map((property) => property.city)).size,
    lowestPrice: Math.min(...PROPERTIES_DATA.map((property) => property.price)),
  };
}
