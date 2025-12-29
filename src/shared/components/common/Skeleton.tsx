import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width={80} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4 p-4">
    <Skeleton variant="circular" width={48} height={48} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="p-4">
        <Skeleton variant="text" />
      </td>
    ))}
  </tr>
);

// Page Skeleton
export const PageSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    <Skeleton variant="text" width="40%" height={32} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  </div>
);
