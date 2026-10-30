"use client";

import { Heart } from "lucide-react";
import { toggleFavourite, useFavourites } from "@/lib/favourites";

interface FavouriteButtonProps {
  slug: string;
  title: string;
  size?: "sm" | "md";
}

export function FavouriteButton({ slug, title, size = "md" }: FavouriteButtonProps) {
  const saved = useFavourites().includes(slug);
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";

  return (
    <button
      type="button"
      onClick={() => toggleFavourite(slug)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved homes` : `Save ${title}`}
      className={`${box} flex shrink-0 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-200 ${
        saved ? "border-brass bg-brass text-ink" : "border-white/15 bg-ink/70 text-ivory hover:border-brass hover:text-brass"
      }`}
    >
      <Heart aria-hidden="true" className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
