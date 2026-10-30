"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

// All photos are stacked and only the active one is opaque, so switching is a CSS crossfade.
// Arrow keys work while focus is inside the gallery only, so the page keeps normal scrolling.
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = images.length;

  const show = (index: number) => setActiveIndex((index + count) % count);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(activeIndex + 1);
    }
  };

  const arrowClass =
    "pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-brass/30 bg-ink/80 text-ivory shadow-lg backdrop-blur-md transition-colors duration-200 hover:bg-brass hover:text-ink";

  return (
    <section aria-roledescription="carousel" aria-label={`${title} photos`} onKeyDown={handleKeyDown} className="space-y-4">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-brass/20 bg-[#0e1624] sm:aspect-[16/9] sm:rounded-3xl"
      >
        {images.map((src, index) => (
          <Image
            key={`${index}-${src}`}
            src={src}
            alt={`${title}, photo ${index + 1} of ${count}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
            aria-hidden={index !== activeIndex}
            className={`object-cover transition-opacity duration-300 ease-out ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-black/20" />

        <p aria-live="polite" className="absolute right-4 top-4 rounded-full border border-brass/25 bg-ink/85 px-3.5 py-1.5 text-xs text-brass backdrop-blur-md sm:right-6 sm:top-6">
          {activeIndex + 1} / {count}
        </p>

        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-3 inset-y-0 flex items-center justify-between sm:inset-x-5">
            <button type="button" onClick={() => show(activeIndex - 1)} aria-label="Previous photo" className={arrowClass}>
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => show(activeIndex + 1)} aria-label="Next photo" className={arrowClass}>
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <ul aria-label="Choose a photo" className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3.5">
          {images.map((src, index) => (
            <li key={`${index}-${src}`}>
              <button
                type="button"
                onClick={() => show(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border-2 transition duration-200 ${
                  index === activeIndex ? "border-brass" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
