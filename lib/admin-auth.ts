import "server-only";
import crypto from "node:crypto";

// The admin cookie holds an HMAC of the password, never the password itself. Changing
// ADMIN_PASSWORD invalidates every existing session.

export const ADMIN_COOKIE = "skyline_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

function sessionToken(password: string): string {
  const key = process.env.IP_HASH_SALT ?? "";
  return crypto.createHmac("sha256", key).update(`admin:${password}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/** Null when no ADMIN_PASSWORD is configured: the admin page is then switched off. */
export function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

export function checkPassword(attempt: string): boolean {
  const password = adminPassword();
  return password !== null && safeEqual(sessionToken(attempt), sessionToken(password));
}

export function tokenForSession(): string | null {
  const password = adminPassword();
  return password === null ? null : sessionToken(password);
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const expected = tokenForSession();
  return expected !== null && cookieValue !== undefined && safeEqual(cookieValue, expected);
}
