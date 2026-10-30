import { NextResponse, type NextRequest } from "next/server";
import { getAllSlugs } from "@/lib/properties";

// With cacheComponents the detail route streams a prerendered shell for unknown slugs, so the
// status is already 200 when notFound() runs. Unknown slugs are caught here instead and rewritten
// to a path no route matches: Next then renders app/not-found.tsx with a real 404 status, and the
// address bar keeps the URL the visitor typed.

const KNOWN_SLUGS = new Set(getAllSlugs());

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !KNOWN_SLUGS.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/home-not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/properties/:slug",
};
