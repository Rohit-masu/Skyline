import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/schema/enquiry";
import { getPropertyBySlug } from "@/lib/properties";
import { checkRateLimit, hashIp, saveEnquiry } from "@/lib/storage/enquiries";

function clientIp(request: NextRequest): string {
  // Vercel puts the real client first in x-forwarded-for.
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  // Honeypot filled: answer like a success so bots learn nothing, but store nothing.
  if (body && typeof body === "object" && "company" in body && typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ id: crypto.randomUUID() }, { status: 201 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      },
      { status: 400 }
    );
  }

  if (!getPropertyBySlug(parsed.data.propertySlug)) {
    return NextResponse.json(
      { error: "Unknown property", issues: [{ path: "propertySlug", message: "This home does not exist" }] },
      { status: 400 }
    );
  }

  try {
    const ipHash = hashIp(clientIp(request));
    const limit = await checkRateLimit(ipHash);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many enquiries from this connection. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { id } = await saveEnquiry(parsed.data, ipHash);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Saving enquiry failed:", error);
    return NextResponse.json({ error: "Could not save your enquiry. Please try again." }, { status: 500 });
  }
}
