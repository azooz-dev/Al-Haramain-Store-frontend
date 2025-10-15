import { Skeleton } from '@shared/components/ui/skeleton';

export function OffersSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-card dark:from-card dark:via-card dark:to-card">
      <div className="container mx-auto px-4 pt-8">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 lg:h-[500px] rounded-2xl" />
            <div className="space-y-8">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
