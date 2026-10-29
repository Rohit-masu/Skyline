import { NextRequest, NextResponse } from "next/server";
import { PROPERTIES_DATA } from "@/data/properties";
import { enquirySchema } from "@/lib/schema/enquiry";
import { hashIp, checkRateLimit, saveEnquiry } from "@/lib/storage/enquiries";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON request" },
      { status: 400 }
    );
  }

  // Extract client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1" : "127.0.0.1";
  const ipHash = hashIp(ip);

  // Rate Limiting (max 5 per 10 minutes)
  const rateLimitResult = checkRateLimit(ipHash);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds ?? 600),
        },
      }
    );
  }

  // Honeypot check (bot protection: if 'company' field is filled, return 201 fake success without saving)
  const candidate = body as Record<string, unknown> | null;
  if (candidate && typeof candidate.company === "string" && candidate.company.trim().length > 0) {
    return NextResponse.json(
      { id: `enq-hp-${Date.now()}`, message: "Enquiry submitted successfully." },
      { status: 201 }
    );
  }

  // Validate request body with Zod schema
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Validate that the property slug actually exists in our database
  const propertyExists = PROPERTIES_DATA.some((p) => p.slug === data.propertySlug);
  if (!propertyExists) {
    return NextResponse.json(
      {
        error: "Referenced property does not exist",
        issues: [
          {
            path: "propertySlug",
            message: `Property with slug '${data.propertySlug}' was not found`,
          },
        ],
      },
      { status: 400 }
    );
  }

  // Save enquiry
  const saved = saveEnquiry(data, ipHash);

  return NextResponse.json(
    {
      id: saved.id,
      message: "Enquiry received. Our private relationship manager will reach out to you shortly.",
    },
    { status: 201 }
  );
}
