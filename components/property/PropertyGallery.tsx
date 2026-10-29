"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  propertyType: string;
}

export function PropertyGallery({ images, title, propertyType }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const safeImages = images && images.length > 0 ? images : ["/images/landing/hero-tower.jpg"];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }, [safeImages.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }, [safeImages.length]);

  // Keyboard navigation: ArrowLeft and ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focused within gallery or active element is body
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section
      ref={galleryRef}
      className="space-y-4"
      aria-label={`${title} Architectural Gallery`}
      tabIndex={0}
      role="region"
    >
      {/* Main Feature Viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0e1624] border border-[rgba(201,163,106,0.2)] shadow-2xl">
        <Image
          src={safeImages[activeIndex] || "/images/landing/hero-tower.jpg"}
          alt={`${title} - View ${activeIndex + 1} of ${safeImages.length} (${propertyType})`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 75vw"
          className="object-cover transition-all duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18]/80 via-transparent to-black/30 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-[#0a0f18]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono text-[#c9a36a] border border-[rgba(201,163,106,0.25)] flex items-center gap-2 pointer-events-none z-10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {activeIndex + 1} / {safeImages.length}
          </span>
        </div>

        {/* Left / Right Nav Arrows */}
        {safeImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none z-10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-[#0a0f18]/80 backdrop-blur-md text-[#f4eee5] hover:text-[#0a0f18] hover:bg-[#c9a36a] border border-[rgba(201,163,106,0.3)] transition-all pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a36a] shadow-lg"
              aria-label="Previous image (ArrowLeft)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-[#0a0f18]/80 backdrop-blur-md text-[#f4eee5] hover:text-[#0a0f18] hover:bg-[#c9a36a] border border-[rgba(201,163,106,0.3)] transition-all pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a36a] shadow-lg"
              aria-label="Next image (ArrowRight)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Keyboard Helper Tooltip (Visible on hover/focus) */}
        <div className="absolute bottom-4 left-4 sm:left-6 text-[11px] font-mono text-[#8f9ba8] bg-[#0a0f18]/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5 pointer-events-none hidden sm:block">
          Use ← / → keyboard arrows to cycle views
        </div>
      </div>

      {/* Thumbnail Bar */}
      {safeImages.length > 1 && (
        <div
          className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 sm:gap-3.5 pt-2"
          role="tablist"
          aria-label="Image Thumbnails"
        >
          {safeImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isActive}
                aria-label={`View image ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0e1624] border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a36a] ${
                  isActive
                    ? "border-[#c9a36a] shadow-[0_0_15px_rgba(201,163,106,0.35)] scale-[1.02]"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-white/20"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
