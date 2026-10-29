export function PropertyCardSkeleton() {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden bg-[#141d2b]/30 border border-[rgba(255,255,255,0.06)] animate-pulse"
      aria-hidden="true"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] w-full bg-[#0e1624] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Locality */}
          <div className="h-3 w-1/3 bg-white/5 rounded-full" />
          {/* Title */}
          <div className="h-6 w-3/4 bg-white/10 rounded-md" />
          {/* Tagline */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-2/3 bg-white/5 rounded" />
          </div>
        </div>

        {/* Specs */}
        <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
          <div className="h-12 bg-white/5 rounded-lg" />
          <div className="h-12 bg-white/5 rounded-lg" />
          <div className="h-12 bg-white/5 rounded-lg" />
        </div>

        {/* Button */}
        <div className="h-9 w-full bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

export function PropertyListingsSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
