import { NextRequest, NextResponse } from "next/server";
import { PROPERTIES_DATA } from "@/data/properties";
import { propertyQuerySchema } from "@/lib/schema/query";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Convert URLSearchParams to a plain object
  const queryObj: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    queryObj[key] = val;
  });

  const parsed = propertyQuerySchema.safeParse(queryObj);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const { q, minPrice, maxPrice, bhk, type, furnished, sort, page, limit } =
    parsed.data;

  let results = [...PROPERTIES_DATA];

  // Search filter (matches title, locality, or city)
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.locality.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term)
    );
  }

  // Price range filters
  if (minPrice !== undefined) {
    results = results.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  // BHK filter
  if (bhk && bhk.length > 0) {
    results = results.filter((p) => bhk.includes(p.bhk));
  }

  // Property Type filter
  if (type && type.length > 0) {
    results = results.filter((p) => type.includes(p.type));
  }

  // Furnished filter
  if (furnished !== undefined) {
    results = results.filter((p) => p.furnished === furnished);
  }

  // Sorting
  if (sort === "price_asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    results.sort((a, b) => b.price - a.price);
  } else {
    // default: newest
    results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Pagination
  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < total;

  return NextResponse.json(
    {
      items: paginatedItems,
      total,
      page,
      hasMore,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
