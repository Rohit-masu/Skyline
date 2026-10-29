import { z } from "zod";
import type { PropertyType, PropertySort } from "@/types/property";

const PROPERTY_TYPES: [PropertyType, ...PropertyType[]] = [
  "Apartment",
  "Penthouse",
  "Duplex",
  "Villa",
];

const SORT_OPTIONS: [PropertySort, ...PropertySort[]] = [
  "price_asc",
  "price_desc",
  "newest",
];

export const propertyQuerySchema = z
  .object({
    q: z
      .string()
      .trim()
      .max(80, "Search query cannot exceed 80 characters")
      .optional(),
    minPrice: z
      .string()
      .regex(/^\d+$/, "minPrice must be a valid positive integer")
      .transform(Number)
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+$/, "maxPrice must be a valid positive integer")
      .transform(Number)
      .optional(),
    bhk: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        const nums = val
          .split(",")
          .map((s) => s.trim())
          .filter((s) => /^[1-4]$/.test(s))
          .map(Number);
        return nums.length > 0 ? nums : undefined;
      }),
    type: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        const types = val
          .split(",")
          .map((s) => s.trim())
          .filter((s): s is PropertyType =>
            PROPERTY_TYPES.includes(s as PropertyType)
          );
        return types.length > 0 ? types : undefined;
      }),
    furnished: z
      .string()
      .optional()
      .transform((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
      }),
    sort: z
      .enum(SORT_OPTIONS)
      .default("newest")
      .catch("newest"),
    page: z
      .string()
      .optional()
      .transform((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 ? Math.floor(num) : 1;
      })
      .default(1),
    limit: z
      .string()
      .optional()
      .transform((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 ? Math.min(Math.floor(num), 24) : 12;
      })
      .default(12),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    }
  );

export type ParsedPropertyQuery = z.infer<typeof propertyQuerySchema>;
