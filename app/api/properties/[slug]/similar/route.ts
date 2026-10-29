import { NextRequest, NextResponse } from "next/server";
import { PROPERTIES_DATA } from "@/data/properties";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const current = PROPERTIES_DATA.find((p) => p.slug === slug);

  if (!current) {
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 }
    );
  }

  // Filter out the current property
  const candidates = PROPERTIES_DATA.filter((p) => p.slug !== slug);

  // Sort by relevance:
  // 1. Same locality (+100 points) or same city (+50 points)
  // 2. Same BHK (+30 points)
  // 3. Difference in price (closer price is better)
  candidates.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.locality === current.locality) scoreA += 100;
    else if (a.city === current.city) scoreA += 50;

    if (b.locality === current.locality) scoreB += 100;
    else if (b.city === current.city) scoreB += 50;

    if (a.bhk === current.bhk) scoreA += 30;
    if (b.bhk === current.bhk) scoreB += 30;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // Closer price wins tie
    const diffA = Math.abs(a.price - current.price);
    const diffB = Math.abs(b.price - current.price);
    return diffA - diffB;
  });

  const similar = candidates.slice(0, 4);

  return NextResponse.json(similar, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
