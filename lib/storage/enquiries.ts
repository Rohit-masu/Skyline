import crypto from "crypto";
import type { Enquiry, EnquiryInput } from "@/types/enquiry";

const IP_HASH_SALT = process.env.IP_HASH_SALT ?? "skyline-salt-secret-key-2026";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// In-memory persistent arrays for server runtime
const globalStore = globalThis as unknown as {
  __skylineEnquiries?: Enquiry[];
  __skylineRateLimits?: Map<string, number[]>;
};

if (!globalStore.__skylineEnquiries) {
  globalStore.__skylineEnquiries = [];
}
if (!globalStore.__skylineRateLimits) {
  globalStore.__skylineRateLimits = new Map<string, number[]>();
}

export function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + IP_HASH_SALT)
    .digest("hex");
}

export function checkRateLimit(ipHash: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const limits = globalStore.__skylineRateLimits!;
  const timestamps = limits.get(ipHash) ?? [];

  // Filter timestamps within the 10-minute window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldestInWindow = recent[0]!;
    const retryAfter = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    limits.set(ipHash, recent);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(retryAfter, 1),
    };
  }

  // Record this attempt
  recent.push(now);
  limits.set(ipHash, recent);
  return { allowed: true };
}

export function saveEnquiry(input: EnquiryInput, ipHash: string): Enquiry {
  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: input.name,
    phone: input.phone,
    email: input.email || undefined,
    message: input.message,
    visitDate: input.visitDate,
    propertySlug: input.propertySlug,
    ipHash,
    createdAt: new Date().toISOString(),
  };

  globalStore.__skylineEnquiries!.unshift(newEnquiry);
  return newEnquiry;
}

export function getEnquiries(): Enquiry[] {
  return [...globalStore.__skylineEnquiries!];
}
