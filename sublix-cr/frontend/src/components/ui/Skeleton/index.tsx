/**
 * Skeleton — animated placeholder shown while content is loading.
 *
 * Use the generic <Skeleton /> for any shimmer block, or use the
 * pre-built <ProductCardSkeleton /> from features/products.
 */

import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedMap = {
  sm:   "rounded",
  md:   "rounded-lg",
  lg:   "rounded-2xl",
  full: "rounded-full",
};

export default function Skeleton({ rounded = "md", className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        roundedMap[rounded],
        className
      )}
      {...props}
    />
  );
}
