import "server-only";
import crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { Enquiry } from "@/types/enquiry";
import type { ValidatedEnquiry } from "@/lib/schema/enquiry";

// Enquiries are stored in Neon Postgres when DATABASE_URL is set (production). Without it (local
// dev, tests) they go to memory so the app still runs. The rate limit counts rows in the same
// table, so it holds across serverless instances. Table: scripts/db-setup.sql.

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MINUTES = 10;
const WINDOW_MS = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

interface EnquiryRow {
  id: string;
  property_slug: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  visit_date: string;
  ip_hash: string;
  created_at: string;
}

/** Only a salted hash of the IP is ever stored. There is deliberately no default salt. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) throw new Error("IP_HASH_SALT is not set (see .env.example)");
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

function retryAfter(oldestInWindow: Date, now: number): number {
  return Math.max(1, Math.ceil((oldestInWindow.getTime() + WINDOW_MS - now) / 1000));
}

function toEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    propertySlug: row.property_slug,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    message: row.message,
    visitDate: String(row.visit_date).slice(0, 10),
    ipHash: row.ip_hash,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

// ---------- Postgres ----------

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

async function checkRateLimitDb(db: NonNullable<typeof sql>, ipHash: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const rows = (await db`
    SELECT count(*)::int AS count, min(created_at) AS oldest
    FROM enquiries
    WHERE ip_hash = ${ipHash} AND created_at > ${since}
  `) as { count: number; oldest: string | null }[];
  const { count = 0, oldest = null } = rows[0] ?? {};
  if (count < RATE_LIMIT_MAX || !oldest) return { allowed: true };
  return { allowed: false, retryAfterSeconds: retryAfter(new Date(oldest), Date.now()) };
}

// ---------- Memory (local dev only) ----------

const memory = globalThis as unknown as { __skylineEnquiries?: Enquiry[] };
memory.__skylineEnquiries ??= [];
const memoryRows = memory.__skylineEnquiries;

function checkRateLimitMemory(ipHash: string): RateLimitResult {
  const now = Date.now();
  const recent = memoryRows
    .filter((row) => row.ipHash === ipHash && now - Date.parse(row.createdAt) < WINDOW_MS)
    .map((row) => Date.parse(row.createdAt))
    .sort((a, b) => a - b);
  if (recent.length < RATE_LIMIT_MAX) return { allowed: true };
  return { allowed: false, retryAfterSeconds: retryAfter(new Date(recent[0] ?? now), now) };
}

// ---------- Public API ----------

export function checkRateLimit(ipHash: string): Promise<RateLimitResult> {
  return sql ? checkRateLimitDb(sql, ipHash) : Promise.resolve(checkRateLimitMemory(ipHash));
}

export async function saveEnquiry(input: ValidatedEnquiry, ipHash: string): Promise<{ id: string }> {
  const email = input.email || null;
  if (sql) {
    const rows = (await sql`
      INSERT INTO enquiries (property_slug, name, phone, email, message, visit_date, ip_hash)
      VALUES (${input.propertySlug}, ${input.name}, ${input.phone}, ${email}, ${input.message}, ${input.visitDate}, ${ipHash})
      RETURNING id
    `) as { id: string }[];
    const id = rows[0]?.id;
    if (!id) throw new Error("Insert returned no id");
    return { id };
  }

  const id = crypto.randomUUID();
  memoryRows.unshift({
    id,
    propertySlug: input.propertySlug,
    name: input.name,
    phone: input.phone,
    email: email ?? undefined,
    message: input.message,
    visitDate: input.visitDate,
    ipHash,
    createdAt: new Date().toISOString(),
  });
  return { id };
}

/** Newest first, for the /admin page. */
export async function listEnquiries(limit = 100): Promise<Enquiry[]> {
  if (sql) {
    const rows = (await sql`
      SELECT id, property_slug, name, phone, email, message, visit_date::text AS visit_date, ip_hash, created_at
      FROM enquiries ORDER BY created_at DESC LIMIT ${limit}
    `) as EnquiryRow[];
    return rows.map(toEnquiry);
  }
  return memoryRows.slice(0, limit);
}

export const storageMode = sql ? "postgres" : "memory";
