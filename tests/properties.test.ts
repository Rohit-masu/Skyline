import { describe, it, expect } from "vitest";
import { getFeaturedProperties, getPropertyBySlug, getSimilarProperties, searchProperties } from "@/lib/properties";
import { parseQueryLenient } from "@/lib/schema/query";

const query = (search: string) => parseQueryLenient(new URLSearchParams(search));

describe("searchProperties", () => {
  it("paginates 12 per page and reports hasMore", () => {
    const first = searchProperties(query(""));
    expect(first.items).toHaveLength(12);
    expect(first.total).toBe(56);
    expect(first.hasMore).toBe(true);

    const last = searchProperties(query("page=5"));
    expect(last.items).toHaveLength(8);
    expect(last.hasMore).toBe(false);
  });

  it("never repeats or skips a home across pages", () => {
    const slugs = [1, 2, 3, 4, 5].flatMap((page) => searchProperties(query(`page=${page}`)).items.map((p) => p.slug));
    expect(new Set(slugs).size).toBe(56);
  });

  it("applies every filter together", () => {
    const result = searchProperties(query("bhk=3,4&minPrice=30000000&furnished=true&sort=price_asc"));
    expect(result.total).toBeGreaterThan(0);
    for (const property of result.items) {
      expect([3, 4]).toContain(property.bhk);
      expect(property.price).toBeGreaterThanOrEqual(30000000);
      expect(property.furnished).toBe(true);
    }
    const prices = result.items.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("matches the search term case-insensitively in title, locality or city", () => {
    const result = searchProperties(query("q=GURGAON"));
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((p) => `${p.title} ${p.locality} ${p.city}`.toLowerCase().includes("gurgaon"))).toBe(true);
  });

  it("returns an empty page beyond the last one", () => {
    expect(searchProperties(query("page=99")).items).toEqual([]);
  });
});

describe("similar and featured", () => {
  it("returns up to 4 similar homes, never the home itself, same locality first", () => {
    const current = getPropertyBySlug("the-horizon-at-skyline");
    expect(current).toBeDefined();
    if (!current) return;
    const similar = getSimilarProperties(current);
    expect(similar.length).toBeLessThanOrEqual(4);
    expect(similar.some((p) => p.slug === current.slug)).toBe(false);
    const localityFlags = similar.map((p) => p.locality === current.locality);
    expect(localityFlags).toEqual([...localityFlags].sort((a, b) => Number(b) - Number(a)));
  });

  it("returns only featured homes", () => {
    const featured = getFeaturedProperties(6);
    expect(featured).toHaveLength(6);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});
