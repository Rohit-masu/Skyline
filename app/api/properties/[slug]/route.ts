import { NextRequest, NextResponse } from "next/server";
import { PROPERTIES_DATA } from "@/data/properties";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const property = PROPERTIES_DATA.find((p) => p.slug === slug);

  if (!property) {
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(property, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
