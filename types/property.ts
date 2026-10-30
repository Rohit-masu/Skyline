export type PropertyType = "Apartment" | "Penthouse" | "Duplex" | "Villa";

export type PropertySort = "price_asc" | "price_desc" | "newest";

export interface PropertySpecifications {
  flooring: string;
  ceilingHeight: string;
  view: string;
  possessionDate: string;
}

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  locality: string;
  city: string;
  price: number; // In Indian Rupees (e.g. 24000000 = 2.4 Cr)
  priceDisplay: string; // e.g. "₹2.4 Cr"
  pricePerSqFt: number; // e.g. 19500
  bhk: 1 | 2 | 3 | 4;
  bathrooms: number;
  parking: number;
  areaSqFt: number;
  type: PropertyType;
  furnished: boolean;
  floor: number;
  totalFloors: number;
  images: string[];
  featured: boolean;
  amenities: string[];
  description: string;
  specifications: PropertySpecifications;
  coordinates: PropertyCoordinates;
  createdAt: string; // ISO 8601
}

export interface PropertiesResponse {
  items: Property[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface ApiErrorResponse {
  error: string;
  issues?: {
    path: string;
    message: string;
  }[];
}
