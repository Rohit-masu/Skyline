import { NextRequest, NextResponse } from "next/server";
import { paramsToRecord, propertyQuerySchema, toPropertyQuery, PAGE_SIZE } from "@/lib/schema/query";
import { searchProperties } from "@/lib/properties";

export async function GET(request: NextRequest) {
  const parsed = propertyQuerySchema.safeParse(paramsToRecord(request.nextUrl.searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const result = searchProperties(toPropertyQuery(parsed.data), parsed.data.limit ?? PAGE_SIZE);

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
