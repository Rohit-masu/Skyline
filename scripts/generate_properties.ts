import fs from "fs";
import type { Property } from "../types/property";

interface PropertySeed {
  title: string;
  tagline: string;
  locality: string;
  city: string;
  bhk: 1 | 2 | 3 | 4;
  type: "Apartment" | "Penthouse" | "Duplex" | "Villa";
  price: number;
  areaSqFt: number;
  bathrooms: number;
  parking: number;
  furnished: boolean;
  floor: number;
  featured: boolean;
  lat: number;
  lng: number;
}

const seeds: PropertySeed[] = [
  {
    title: "The Horizon at Skyline",
    tagline: "Panoramic Golf Course vistas with triple-aspect glass facade",
    locality: "Golf Course Road, Sector 63",
    city: "Gurgaon",
    bhk: 3,
    type: "Apartment",
    price: 42000000,
    areaSqFt: 2450,
    bathrooms: 3,
    parking: 2,
    furnished: true,
    floor: 18,
    featured: true,
    lat: 28.4595,
    lng: 77.0266,
  },
  {
    title: "Skyline Residences Suite 1204",
    tagline: "Intelligently planned dual-aspect suite with private breakfast deck",
    locality: "Golf Course Ext Road, Sector 62",
    city: "Gurgaon",
    bhk: 2,
    type: "Apartment",
    price: 28000000,
    areaSqFt: 1380,
    bathrooms: 2,
    parking: 1,
    furnished: true,
    floor: 12,
    featured: true,
    lat: 28.4125,
    lng: 77.0782,
  },
  {
    title: "The Crest Royal Mansion",
    tagline: "Palatial 4 BHK sky residence with private plunge pool and staff quarters",
    locality: "DLF Phase 5, Golf Course Road",
    city: "Gurgaon",
    bhk: 4,
    type: "Apartment",
    price: 65000000,
    areaSqFt: 3700,
    bathrooms: 4,
    parking: 3,
    furnished: true,
    floor: 22,
    featured: true,
    lat: 28.4735,
    lng: 77.0945,
  },
  {
    title: "Palm View Sky Residence",
    tagline: "Overlooking lush Aravalli hills with 40-foot continuous balcony",
    locality: "Golf Course Road, Sector 54",
    city: "Gurgaon",
    bhk: 3,
    type: "Apartment",
    price: 39000000,
    areaSqFt: 2100,
    bathrooms: 3,
    parking: 2,
    furnished: false,
    floor: 14,
    featured: true,
    lat: 28.4412,
    lng: 77.1084,
  },
  {
    title: "The Aura Executive Suite",
    tagline: "Bespoke bachelor or executive pied-a-terre with smart home automation",
    locality: "Cyber City, DLF Phase 2",
    city: "Gurgaon",
    bhk: 2,
    type: "Apartment",
    price: 24000000,
    areaSqFt: 1250,
    bathrooms: 2,
    parking: 1,
    furnished: true,
    floor: 8,
    featured: true,
    lat: 28.4905,
    lng: 77.0898,
  },
  {
    title: "West End Crown Duplex",
    tagline: "Double-height penthouse crowning the 28th floor with 360-degree skyline",
    locality: "Golf Course Road, Sector 42",
    city: "Gurgaon",
    bhk: 4,
    type: "Penthouse",
    price: 72000000,
    areaSqFt: 4600,
    bathrooms: 5,
    parking: 4,
    furnished: true,
    floor: 28,
    featured: true,
    lat: 28.4611,
    lng: 77.0921,
  },
];

const localities = [
  { loc: "Golf Course Road, Sector 54", city: "Gurgaon", lat: 28.441, lng: 77.108 },
  { loc: "DLF Phase 5", city: "Gurgaon", lat: 28.473, lng: 77.094 },
  { loc: "Vasant Vihar, Block C", city: "Delhi", lat: 28.562, lng: 77.161 },
  { loc: "Chanakyapuri Diplomatic Enclave", city: "Delhi", lat: 28.598, lng: 77.192 },
  { loc: "Defence Colony", city: "Delhi", lat: 28.571, lng: 77.234 },
  { loc: "Worli Sea Face", city: "Mumbai", lat: 19.009, lng: 72.815 },
  { loc: "Bandra West, Carter Road", city: "Mumbai", lat: 19.066, lng: 72.825 },
  { loc: "Lower Parel, One Avighna", city: "Mumbai", lat: 18.995, lng: 72.831 },
  { loc: "Juhu Tara Road", city: "Mumbai", lat: 19.098, lng: 72.826 },
  { loc: "Lavelle Road", city: "Bangalore", lat: 12.971, lng: 77.596 },
  { loc: "Sadashivanagar", city: "Bangalore", lat: 13.007, lng: 77.581 },
  { loc: "Indiranagar 100ft Rd", city: "Bangalore", lat: 12.978, lng: 77.640 },
  { loc: "Jubilee Hills, Road No 36", city: "Hyderabad", lat: 17.432, lng: 78.407 },
  { loc: "Assagao Highland", city: "Goa", lat: 15.591, lng: 73.778 },
];

const adjectives = [
  "The Sovereign", "The Luminary", "The Bel Air", "The Imperial", "The Grand Reserve",
  "The Altius", "The Celestial", "The Regent", "The Aurelia", "The Zenith",
  "The Solitaire", "The Avant-Garde", "The Elysian", "The Paramount", "The Mirage",
  "The Pinnacle", "The Bellevue", "The Opulence", "The Signature", "The Sanctuary"
];

const types: ("Apartment" | "Penthouse" | "Duplex" | "Villa")[] = [
  "Apartment", "Apartment", "Apartment", "Penthouse", "Duplex", "Villa"
];

const allAmenities = [
  "Infinity Pool", "Sky Wellness Gym", "Private Elevator", "Italian Marble",
  "Home Automation", "24x7 Valet Concierge", "Private Wine Cellar", "Temperature Controlled Deck",
  "EV Fast Charging", "Banquet Pavilion", "Kids Adventure Park", "Spa & Sauna Suite"
];

const imagesPool = [
  "/images/landing/hero-tower.jpg",
  "/images/landing/interior-living.jpg",
  "/images/landing/amenity-pool.jpg",
  "/images/landing/amenity-gym.jpg",
  "/images/landing/rooftop-night.jpg",
  "/images/properties/property-exterior-crest.jpg",
  "/images/properties/property-interior-bedroom.jpg",
  "/images/landing/floorplan-3bhk.jpg",
];

function formatPriceDisplay(price: number): string {
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  const l = price / 100000;
  return `₹${l.toFixed(0)} Lakh`;
}

const properties: Property[] = seeds.map((s, idx) => {
  const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id: `prop-${idx + 1}`,
    slug,
    title: s.title,
    tagline: s.tagline,
    locality: s.locality,
    city: s.city,
    price: s.price,
    priceDisplay: formatPriceDisplay(s.price),
    pricePerSqFt: Math.round(s.price / s.areaSqFt),
    bhk: s.bhk,
    bathrooms: s.bathrooms,
    parking: s.parking,
    areaSqFt: s.areaSqFt,
    type: s.type,
    furnished: s.furnished,
    floor: s.floor,
    totalFloors: 28,
    images: [
      imagesPool[idx % imagesPool.length]!,
      imagesPool[(idx + 1) % imagesPool.length]!,
      imagesPool[(idx + 2) % imagesPool.length]!,
      imagesPool[(idx + 3) % imagesPool.length]!,
    ],
    featured: s.featured,
    amenities: allAmenities.slice(0, 6 + (idx % 4)),
    description: `A masterclass in modern architectural luxury, ${s.title} combines bespoke finishes with expansive glass facades offering uninterrupted views of ${s.locality}. Featuring high thermal insulation double glazing, Italian Statuario marble floors, and state-of-the-art Lutron home automation.`,
    specifications: {
      flooring: "Imported Italian Statuario Marble & European Engineered Oak",
      ceilingHeight: "11 ft clear finished height",
      view: "Panoramic Skyline & Golf Course greens",
      possessionDate: "December 2026",
    },
    coordinates: { lat: s.lat, lng: s.lng },
    createdAt: new Date(Date.now() - idx * 86400000 * 2).toISOString(),
  };
});

let count = properties.length;
for (let i = 0; i < 50; i++) {
  count++;
  const adj = adjectives[i % adjectives.length]!;
  const locObj = localities[i % localities.length]!;
  const bhk = (((i % 4) + 1) as 1 | 2 | 3 | 4);
  const propType = types[i % types.length]!;
  
  let basePrice = 18000000;
  let area = 950;
  if (bhk === 2) { basePrice = 28000000 + (i % 7) * 1000000; area = 1350 + (i % 5) * 50; }
  else if (bhk === 3) { basePrice = 42000000 + (i % 9) * 2000000; area = 2200 + (i % 7) * 80; }
  else if (bhk === 4) {
    basePrice = propType === "Penthouse" || propType === "Villa"
      ? 85000000 + (i % 7) * 8000000 
      : 65000000 + (i % 6) * 3000000;
    area = 3600 + (i % 8) * 150;
  }
  
  const title = `${adj} ${propType === "Apartment" ? "Residence" : propType} ${100 + i}`;
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${locObj.city.toLowerCase()}`.replace(/^-|-$/g, "");
  
  properties.push({
    id: `prop-${count}`,
    slug,
    title,
    tagline: `Ultra-luxury ${bhk} BHK ${propType} situated in the prestigious enclave of ${locObj.loc}`,
    locality: locObj.loc,
    city: locObj.city,
    price: basePrice,
    priceDisplay: formatPriceDisplay(basePrice),
    pricePerSqFt: Math.round(basePrice / area),
    bhk,
    bathrooms: bhk === 1 ? 1 : bhk === 2 ? 2 : bhk === 3 ? 3 : 4 + (i % 2),
    parking: bhk <= 2 ? 1 : bhk === 3 ? 2 : 3,
    areaSqFt: area,
    type: propType,
    furnished: i % 3 !== 0,
    floor: Math.min((i % 27) + 2, 28),
    totalFloors: 28,
    images: [
      imagesPool[(i + 1) % imagesPool.length]!,
      imagesPool[(i + 3) % imagesPool.length]!,
      imagesPool[(i + 5) % imagesPool.length]!,
      imagesPool[(i + 7) % imagesPool.length]!,
    ],
    featured: i < 6,
    amenities: allAmenities.slice(0, 6 + (i % 5)),
    description: `Designed for discerning tastemakers, ${title} in ${locObj.city} offers unprecedented luxury. With architectural floor plans oriented to maximize cross-ventilation and golden-hour natural illumination, this residence exemplifies elevated urban living.`,
    specifications: {
      flooring: "Imported Greek Thassos White Marble & German Oak",
      ceilingHeight: propType === "Penthouse" ? "14 ft double-height" : "11.5 ft clear finished",
      view: `${locObj.city} Skyline & Lush Tree Canopies`,
      possessionDate: i % 2 === 0 ? "Ready to Move" : "October 2026",
    },
    coordinates: {
      lat: Number((locObj.lat + (Math.sin(i) * 0.01)).toFixed(4)),
      lng: Number((locObj.lng + (Math.cos(i) * 0.01)).toFixed(4)),
    },
    createdAt: new Date(Date.now() - (i + 6) * 86400000).toISOString(),
  });
}

const fileContent = `import type { Property } from "@/types/property";\n\nexport const PROPERTIES_DATA: Property[] = ${JSON.stringify(properties, null, 2)};\n`;

fs.writeFileSync("/home/rohit/skyline/data/properties.ts", fileContent, "utf-8");
console.log(`Successfully generated ${properties.length} luxury properties in data/properties.ts`);
