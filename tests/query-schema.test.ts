import { describe, it, expect } from "vitest";
import { propertyQuerySchema } from "@/lib/schema/query";

describe("Property Query Schema Validation", () => {
  it("parses valid default parameters", () => {
    const parsed = propertyQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.limit).toBe(12);
      expect(parsed.data.sort).toBe("newest");
    }
  });

  it("parses search query and trims it", () => {
    const parsed = propertyQuerySchema.safeParse({ q: "  Golf Course  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.q).toBe("Golf Course");
    }
  });

  it("parses BHK comma-separated values into number array", () => {
    const parsed = propertyQuerySchema.safeParse({ bhk: "2,3,4" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.bhk).toEqual([2, 3, 4]);
    }
  });

  it("parses PropertyType values", () => {
    const parsed = propertyQuerySchema.safeParse({ type: "Penthouse,Villa" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.type).toEqual(["Penthouse", "Villa"]);
    }
  });

  it("rejects invalid price ranges where minPrice > maxPrice", () => {
    const parsed = propertyQuerySchema.safeParse({
      minPrice: "50000000",
      maxPrice: "20000000",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts valid price ranges where minPrice <= maxPrice", () => {
    const parsed = propertyQuerySchema.safeParse({
      minPrice: "20000000",
      maxPrice: "50000000",
    });
    expect(parsed.success).toBe(true);
  });
});
