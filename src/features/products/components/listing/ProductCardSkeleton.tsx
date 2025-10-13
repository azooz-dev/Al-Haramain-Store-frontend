import React from "react";
import { Skeleton } from "@shared/components/ui/skeleton";

export const ProductCardSkeleton: React.FC = () => {
    return (
    <div className="group relative overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden">
        <Skeleton className="aspect-[4/5] w-full" />
        
        {/* Badges Skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-8 rounded" />
        </div>
        
        {/* Heart Button Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Product Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        
        {/* Action Button */}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}