import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const CategorySkeleton: React.FC = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
			<div className="container mx-auto px-4 py-8">
				{/* Header Skeleton */}
				<div className="mb-8">
					<Skeleton className="h-8 w-32 mb-4" />
					<Skeleton className="h-12 w-96 mb-4" />
					<Skeleton className="h-6 w-64" />
				</div>

				{/* Content Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<Skeleton className="h-96 rounded-lg" />
					</div>
					<div className="space-y-4">
						<Skeleton className="h-8" />
						<Skeleton className="h-4" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			</div>
		</div>
	);
};