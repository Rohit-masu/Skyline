import { describe, it, expect } from "vitest";
import {
  parseQueryLenient,
  propertyQuerySchema,
  serializeQuery,
  toPropertyQuery,
} from "@/lib/schema/query";

describe("strict query schema (API)", () => {
  it("fills defaults when no params are given", () => {
    const parsed = propertyQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(toPropertyQuery(parsed.data)).toEqual({
        q: "",
        minPrice: undefined,
        maxPrice: undefined,
        bhk: [],
        type: [],
        furnished: undefined,
        sort: "newest",
        page: 1,
      });
    }
  });

  it("trims the search term and parses lists", () => {
    const parsed = propertyQuerySchema.safeParse({ q: "  Golf Course  ", bhk: "3,2", type: "Penthouse,Villa" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.q).toBe("Golf Course");
      expect(parsed.data.bhk).toEqual([2, 3]);
      expect(parsed.data.type).toEqual(["Penthouse", "Villa"]);
    }
  });

  it.each([
    [{ minPrice: "50000000", maxPrice: "20000000" }, "minPrice"],
    [{ page: "0" }, "page"],
    [{ page: "abc" }, "page"],
    [{ limit: "100" }, "limit"],
    [{ bhk: "2,7" }, "bhk"],
    [{ type: "Castle" }, "type"],
    [{ sort: "cheapest" }, "sort"],
    [{ furnished: "yes" }, "furnished"],
    [{ q: "x".repeat(81) }, "q"],
  ])("rejects %o with an issue on %s", (input, path) => {
    const parsed = propertyQuerySchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues[0]?.path.join(".")).toBe(path);
  });

  it("ignores unknown params", () => {
    expect(propertyQuerySchema.safeParse({ utm_source: "x" }).success).toBe(true);
  });
});

describe("lenient parse (pages and client)", () => {
  it("drops only the invalid values", () => {
    const query = parseQueryLenient(new URLSearchParams("bhk=2&page=-4&sort=nope&type=Villa,Castle&q=worli"));
    expect(query).toMatchObject({ bhk: [2], page: 1, sort: "newest", type: [], q: "worli" });
  });

  it("drops maxPrice when the range is impossible", () => {
    const query = parseQueryLenient({ minPrice: "50000000", maxPrice: "100" });
    expect(query.minPrice).toBe(50000000);
    expect(query.maxPrice).toBeUndefined();
  });

  it("uses the first value of repeated params", () => {
    expect(parseQueryLenient({ q: ["first", "second"] }).q).toBe("first");
  });
});

describe("serializeQuery", () => {
  it("writes a canonical string and leaves defaults out", () => {
    const query = parseQueryLenient(new URLSearchParams("page=1&sort=newest&type=Villa,Apartment&bhk=3,1&q=%20powai%20"));
    expect(serializeQuery(query)).toBe("q=powai&bhk=1%2C3&type=Apartment%2CVilla");
  });

  it("round-trips through the lenient parser", () => {
    const search = "q=worli&minPrice=10000000&maxPrice=50000000&bhk=2&type=Penthouse&furnished=false&sort=price_desc&page=2";
    expect(serializeQuery(parseQueryLenient(new URLSearchParams(search)))).toBe(
      new URLSearchParams(search).toString()
    );
  });
});
