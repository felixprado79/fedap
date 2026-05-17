/**
 * ProductCardSkeleton — animated placeholder that mimics a ProductCard.
 *
 * Shown in the grid while products are loading.
 * The layout matches ProductCard exactly so the page doesn't "jump"
 * when real content arrives.
 */

import Skeleton from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Image placeholder */}
      <Skeleton rounded="sm" className="aspect-[4/3] w-full rounded-none" />

      <div className="flex flex-col gap-3 p-5">
        {/* Badge */}
        <Skeleton className="h-5 w-24" rounded="full" />
        {/* Title */}
        <Skeleton className="h-5 w-full" rounded="md" />
        <Skeleton className="h-4 w-3/4" rounded="md" />
        {/* Description */}
        <Skeleton className="h-4 w-full" rounded="md" />
        <Skeleton className="h-4 w-5/6" rounded="md" />
        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
        </div>
        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-10 flex-1" rounded="lg" />
          <Skeleton className="h-10 w-10" rounded="lg" />
        </div>
      </div>
    </div>
  );
}
