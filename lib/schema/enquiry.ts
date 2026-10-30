import { z } from "zod";

export const VISIT_WINDOW_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "Today" (plus offset days) as YYYY-MM-DD in Asia/Kolkata, whatever timezone the server or browser is in. */
export function getKolkataDateString(offsetDays = 0, now = Date.now()): string {
  // Plain millisecond arithmetic: no local-timezone or DST effects. India has no DST.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now + offsetDays * DAY_MS));
}

/** Rejects strings like 2026-02-31 that match the pattern but are not real dates. */
function isRealDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

// Normalize phone: strip spaces, dashes, parentheses, leading "+91" or "0"
export function normalizeIndianPhone(input: string): string {
  let cleaned = input.replace(/[\s\-\(\)\.]/g, "");
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

export const enquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name cannot exceed 80 characters"),
    phone: z
      .string()
      .transform(normalizeIndianPhone)
      .refine(
        (val) => /^[6-9]\d{9}$/.test(val),
        "Please enter a valid 10-digit Indian mobile number (e.g. 9812345678)"
      ),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message cannot exceed 1000 characters"),
    visitDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a visit date")
      .refine(isRealDate, "Please choose a valid date")
      .refine((dateStr) => {
        const today = getKolkataDateString(0);
        const maxDate = getKolkataDateString(VISIT_WINDOW_DAYS);
        return dateStr >= today && dateStr <= maxDate;
      }, `Visit date must be between today and the next ${VISIT_WINDOW_DAYS} days`),
    propertySlug: z
      .string()
      .trim()
      .min(1, "Property reference is required"),
    company: z
      .string()
      .optional()
      .refine((val) => !val || val.length === 0, {
        message: "Spam detected",
      }),
  });

export type ValidatedEnquiry = z.infer<typeof enquirySchema>;
