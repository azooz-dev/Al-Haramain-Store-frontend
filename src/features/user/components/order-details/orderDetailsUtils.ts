import {
  Clock,
  AlertCircle,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';

/**
 * Get the appropriate icon for order status
 */
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'processing':
      return AlertCircle;
    case 'shipped':
      return Truck;
    case 'delivered':
      return CheckCircle;
    case 'cancelled':
      return XCircle;
    default:
      return Clock;
  }
};

/**
 * Get the appropriate color classes for order status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Format price based on RTL/LTR direction
 */
export const formatPrice = (price: string | number, isRTL: boolean): string => {
  return isRTL 
    ? `${price.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)])}$` 
    : `${price.toString()}$`;
};

/**
 * Format date based on RTL/LTR locale
 */
export const formatDate = (dateString: string, isRTL: boolean): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date without time
 */
export const formatDateOnly = (dateString: string, isRTL: boolean): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

