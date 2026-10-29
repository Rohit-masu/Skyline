import { describe, it, expect } from "vitest";
import { formatPrice, formatArea, formatNumber } from "@/lib/format";

describe("Format Utilities", () => {
  it("formats prices in Crores correctly", () => {
    expect(formatPrice(42000000)).toBe("₹4.2 Cr");
    expect(formatPrice(100000000)).toBe("₹10 Cr");
    expect(formatPrice(115000000)).toBe("₹11.5 Cr");
    expect(formatPrice(27500000)).toBe("₹2.75 Cr");
  });

  it("formats prices in Lakhs correctly", () => {
    expect(formatPrice(8500000)).toBe("₹85 L");
    expect(formatPrice(500000)).toBe("₹5 L");
  });

  it("formats area in square feet", () => {
    expect(formatArea(2450)).toBe("2,450 sq.ft");
    expect(formatArea(6800)).toBe("6,800 sq.ft");
  });

  it("formats numbers with Indian grouping", () => {
    expect(formatNumber(19500)).toBe("19,500");
    expect(formatNumber(1000000)).toBe("10,00,000");
  });
});
