import React, { useState } from "react";
import { Star } from "lucide-react";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface ReviewStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  showText?: boolean;
  className?: string;
}

export const ReviewStarRating: React.FC<ReviewStarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  readOnly = false,
  showText = false,
  className = ''
}) => {
  const { isRTL } = useApp();
  const [hoverRating, setHoverRating] = useState(0);
  const { t: reviewT } = useFeatureTranslations("user");

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const getRatingText = (ratingValue: number) => {
    switch (ratingValue) {
      case 1:
        return reviewT("poor");
      case 2:
        return reviewT("fair");
      case 3:
        return reviewT("good");
      case 4:
        return reviewT("veryGood");
      case 5:
        return reviewT("excellent");
      default:
        return reviewT("noRating");
    }
  }

  const handleStarClick = (starRating: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starRating);
    }
  }

  const handleStarHover = (starRating: number) => {
    if (!readOnly) {
      setHoverRating(starRating);
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  }

  const displayRating = readOnly ? hoverRating : rating;

    return (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${className}`}>
      <div 
        className={`flex ${isRTL ? 'flex-row-reverse' : ''} ${!readOnly ? 'cursor-pointer' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            className={`${sizeClasses[size]} transition-all duration-200 ${
              readOnly ? 'cursor-default' : 'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 rounded'
            }`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-full h-full transition-colors duration-200 ${
                star <= displayRating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
              } ${!readOnly && hoverRating >= star ? 'fill-amber-300 text-amber-300' : ''}`}
            />
          </button>
        ))}
      </div>

      {showText && displayRating > 0 && (
        <span className={`${textSizeClasses[size]} text-muted-foreground ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
          {getRatingText(displayRating)}
        </span>
      )}
      
      {showText && readOnly && (
        <span className={`${textSizeClasses[size]} text-muted-foreground ml-1 ${isRTL ? 'mr-1 ml-0' : ''}`}>
          ({rating}.0)
        </span>
      )}
    </div>
  );
}