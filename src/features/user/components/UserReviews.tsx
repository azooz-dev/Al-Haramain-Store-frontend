import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { ReviewList } from './reviews/ReviewList';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { Star } from 'lucide-react';
import { useApp } from '@/shared/contexts/AppContext';

interface UserReviewsProps {
  userId: number;
}

export const UserReviews: React.FC<UserReviewsProps> = ({ userId }) => {
  const { t: featureT } = useFeatureTranslations("user");
  const { isRTL } = useApp();
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star className="h-6 w-6 text-amber-600" />
          {featureT("userReviews.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReviewList userId={userId} />
      </CardContent>
    </Card>
  )

}