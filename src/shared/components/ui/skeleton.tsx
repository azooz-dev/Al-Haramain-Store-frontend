import * as React from 'react';

import { cn } from '@shared/utils/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export function Skeleton({ className, radius = 'md', ...props }: SkeletonProps) {
  const radiusClass =
    radius === 'none'
      ? 'rounded-none'
      : radius === 'sm'
      ? 'rounded'
      : radius === 'md'
      ? 'rounded-md'
      : radius === 'lg'
      ? 'rounded-lg'
      : radius === 'xl'
      ? 'rounded-xl'
      : 'rounded-full';

  return (
    <div
      className={cn('animate-pulse bg-muted', radiusClass, className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={cn('h-3 w-full animate-pulse bg-muted rounded')}></div>
      ))}
    </div>
  );
}

 
