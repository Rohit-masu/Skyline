import { describe, it, expect } from "vitest";
import { enquirySchema, normalizeIndianPhone, getKolkataDateString } from "@/lib/schema/enquiry";

describe("Enquiry Schema & Phone Normalization", () => {
  it("normalizes various Indian phone formats correctly", () => {
    expect(normalizeIndianPhone("+91 98123 45678")).toBe("9812345678");
    expect(normalizeIndianPhone("09812345678")).toBe("9812345678");
    expect(normalizeIndianPhone("919812345678")).toBe("9812345678");
    expect(normalizeIndianPhone("98123-45678")).toBe("9812345678");
    expect(normalizeIndianPhone("(98123) 45678")).toBe("9812345678");
  });

  it("validates valid enquiry payload", () => {
    const validData = {
      name: "Rohit Sharma",
      phone: "+91 98123 45678",
      email: "rohit@skyline.in",
      visitDate: getKolkataDateString(3),
      message: "Looking forward to inspecting the penthouse floor plans.",
      propertySlug: "the-horizon-at-skyline",
      company: "",
    };

    const parsed = enquirySchema.safeParse(validData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.phone).toBe("9812345678");
      expect(parsed.data.name).toBe("Rohit Sharma");
    }
  });

  it("accepts valid enquiry with empty optional email", () => {
    const validData = {
      name: "Aanya Verma",
      phone: "7890123456",
      email: "",
      visitDate: getKolkataDateString(1),
      message: "Please share pricing breakdown and availability details.",
      propertySlug: "skyline-residences-suite-1204",
      company: "",
    };

    const parsed = enquirySchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("rejects phone numbers with invalid starting digits (not 6-9)", () => {
    const invalidData = {
      name: "Test User",
      phone: "1234567890",
      visitDate: getKolkataDateString(1),
      message: "This should fail because phone starts with 1",
      propertySlug: "the-horizon-at-skyline",
    };

    const parsed = enquirySchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("rejects past visit dates", () => {
    const invalidData = {
      name: "Test User",
      phone: "9812345678",
      visitDate: "2020-01-01",
      message: "This should fail because visit date is in the past",
      propertySlug: "the-horizon-at-skyline",
    };

    const parsed = enquirySchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("rejects honeypot filled submissions", () => {
    const botData = {
      name: "Spam Bot",
      phone: "9812345678",
      visitDate: getKolkataDateString(1),
      message: "Buy cheap luxury backlinks today!",
      propertySlug: "the-horizon-at-skyline",
      company: "Bot Agency Inc",
    };

    const parsed = enquirySchema.safeParse(botData);
    expect(parsed.success).toBe(false);
  });
});
