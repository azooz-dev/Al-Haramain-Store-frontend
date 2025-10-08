import React from 'react';
import { cn } from '@shared/utils/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const colorClasses = {
  primary: 'border-gray-900 dark:border-gray-100',
  secondary: 'border-gray-600 dark:border-gray-400',
  white: 'border-white',
  gray: 'border-gray-500',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  color = 'primary',
}) => {
  return (
    <div
      className={cn(
        'border-2 border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

// Convenience components for common use cases
export const ButtonSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Spinner size="sm" color="white" className={className} />
);

export const PageSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Spinner size="lg" color="primary" className={className} />
);

export const InlineSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Spinner size="sm" color="secondary" className={className} />
);
