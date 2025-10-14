import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export  const FavoritesSkeleton: React.FC<{ layout: 'grid' | 'list' }> = ({ layout }) => {
  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Skeleton className="w-20 h-20" radius="lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="w-4 h-4" radius="full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="p-4">
            <Skeleton className="w-full h-48 mb-4" radius="lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FavoritesSkeleton;
