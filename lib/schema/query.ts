import { z } from "zod";
import type { PropertyType, PropertySort } from "@/types/property";

// One query module shared by the API (strict: 400 on bad input), the listings page (lenient: bad
// values are dropped) and the client (reads and writes the URL). Same rules everywhere.

export const PROPERTY_TYPES: readonly PropertyType[] = ["Apartment", "Penthouse", "Duplex", "Villa"];
export const SORT_OPTIONS: readonly PropertySort[] = ["newest", "price_asc", "price_desc"];
export const BHK_OPTIONS = [1, 2, 3, 4] as const;

export const DEFAULT_SORT: PropertySort = "newest";
export const PAGE_SIZE = 12;
export const MAX_LIMIT = 24;
export const MAX_SEARCH_LENGTH = 80;

/** The listing query after parsing. Arrays are empty (not undefined) when no filter is set. */
export interface PropertyQuery {
  q: string;
  minPrice?: number;
  maxPrice?: number;
  bhk: number[];
  type: PropertyType[];
  furnished?: boolean;
  sort: PropertySort;
  page: number;
}

const rupees = (field: string) =>
  z.string().regex(/^\d{1,12}$/, `${field} must be a whole number of rupees`).transform(Number);

const commaList = <T extends string>(allowed: readonly T[], field: string) =>
  z
    .string()
    .transform((value) => value.split(",").map((item) => item.trim()))
    .refine((items) => items.every((item) => (allowed as readonly string[]).includes(item)), {
      message: `${field} must be a comma list of: ${allowed.join(", ")}`,
    })
    .transform((items) => [...new Set(items as T[])]);

// Each URL param validated on its own, so the lenient parser can drop just the bad ones.
const fieldSchemas = {
  q: z.string().trim().max(MAX_SEARCH_LENGTH, `q cannot exceed ${MAX_SEARCH_LENGTH} characters`),
  minPrice: rupees("minPrice"),
  maxPrice: rupees("maxPrice"),
  bhk: commaList(["1", "2", "3", "4"], "bhk").transform((items) => items.map(Number).sort((a, b) => a - b)),
  type: commaList(PROPERTY_TYPES, "type"),
  furnished: z.enum(["true", "false"], "furnished must be true or false").transform((v) => v === "true"),
  sort: z.enum(SORT_OPTIONS as [PropertySort, ...PropertySort[]], `sort must be one of: ${SORT_OPTIONS.join(", ")}`),
  page: z.string().regex(/^[1-9]\d{0,4}$/, "page must be a positive integer").transform(Number),
  limit: z
    .string()
    .regex(/^\d{1,2}$/, "limit must be an integer")
    .transform(Number)
    .refine((n) => n >= 1 && n <= MAX_LIMIT, `limit must be between 1 and ${MAX_LIMIT}`),
};

type FieldName = keyof typeof fieldSchemas;
const FIELD_NAMES = Object.keys(fieldSchemas) as FieldName[];

/** Strict schema for the API: unknown params are ignored, invalid values fail. */
export const propertyQuerySchema = z
  .object({
    q: fieldSchemas.q.optional(),
    minPrice: fieldSchemas.minPrice.optional(),
    maxPrice: fieldSchemas.maxPrice.optional(),
    bhk: fieldSchemas.bhk.optional(),
    type: fieldSchemas.type.optional(),
    furnished: fieldSchemas.furnished.optional(),
    sort: fieldSchemas.sort.optional(),
    page: fieldSchemas.page.optional(),
    limit: fieldSchemas.limit.optional(),
  })
  .refine((data) => data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice, {
    message: "minPrice cannot be greater than maxPrice",
    path: ["minPrice"],
  });

export type ParsedPropertyQuery = z.infer<typeof propertyQuerySchema>;

/** Fills defaults so the rest of the app never handles undefined arrays, sort or page. */
export function toPropertyQuery(parsed: ParsedPropertyQuery): PropertyQuery {
  return {
    q: parsed.q ?? "",
    minPrice: parsed.minPrice,
    maxPrice: parsed.maxPrice,
    bhk: parsed.bhk ?? [],
    type: parsed.type ?? [],
    furnished: parsed.furnished,
    sort: parsed.sort ?? DEFAULT_SORT,
    page: parsed.page ?? 1,
  };
}

type RawParams = URLSearchParams | Record<string, string | string[] | undefined>;

/** Turns URLSearchParams or Next's searchParams object into plain strings (first value wins). */
export function paramsToRecord(params: RawParams): Record<string, string> {
  const record: Record<string, string> = {};
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      if (!(key in record)) record[key] = value;
    });
    return record;
  }
  for (const [key, value] of Object.entries(params)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) record[key] = first;
  }
  return record;
}

/** For the page and the client: a shared link with one bad value still shows results. */
export function parseQueryLenient(params: RawParams): PropertyQuery {
  const record = paramsToRecord(params);
  const parsed: Record<string, unknown> = {};
  for (const name of FIELD_NAMES) {
    const raw = record[name];
    if (raw === undefined || raw === "") continue;
    const result = fieldSchemas[name].safeParse(raw);
    if (result.success) parsed[name] = result.data;
  }
  const query = toPropertyQuery(parsed as ParsedPropertyQuery);
  if (query.minPrice !== undefined && query.maxPrice !== undefined && query.minPrice > query.maxPrice) {
    query.maxPrice = undefined;
  }
  return query;
}

/** Canonical URL string (no leading "?"): fixed param order, defaults left out. */
export function serializeQuery(query: PropertyQuery): string {
  const params = new URLSearchParams();
  const q = query.q.trim();
  if (q) params.set("q", q);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.bhk.length > 0) params.set("bhk", [...query.bhk].sort((a, b) => a - b).join(","));
  if (query.type.length > 0) params.set("type", PROPERTY_TYPES.filter((t) => query.type.includes(t)).join(","));
  if (query.furnished !== undefined) params.set("furnished", String(query.furnished));
  if (query.sort !== DEFAULT_SORT) params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params.toString();
}

export function hasActiveFilters(query: PropertyQuery): boolean {
  return (
    query.q.trim() !== "" ||
    query.minPrice !== undefined ||
    query.maxPrice !== undefined ||
    query.bhk.length > 0 ||
    query.type.length > 0 ||
    query.furnished !== undefined
  );
}
