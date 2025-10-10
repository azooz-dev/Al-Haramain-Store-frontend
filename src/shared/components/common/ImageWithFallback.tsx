﻿import React, { useState, useCallback } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

/**
 * ImageWithFallback component provides an image with fallback handling and lazy loading.
 * Features:
 * - Automatic fallback to error image on load failure
 * - Lazy loading for performance optimization
 * - Smooth opacity transition on load
 * - Memoized for performance
 * 
 * @param props - Standard img HTML attributes
 * @returns JSX element representing the image with fallback
 */
export const ImageWithFallback = React.memo<React.ImgHTMLAttributes<HTMLImageElement>>(function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false)

  const handleError = useCallback(() => {
    setDidError(true)
  }, [])

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      style={style} 
      {...rest} 
      onError={handleError}
      loading="lazy"
    />
  )
})
