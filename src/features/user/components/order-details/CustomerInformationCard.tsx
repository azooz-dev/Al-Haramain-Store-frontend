import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Mail, User as UserIcon, CreditCard, Calendar } from 'lucide-react';
import type { User } from '@/features/auth/types';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { formatDateOnly } from './orderDetailsUtils';

interface CustomerInformationCardProps {
  customer: User;
}

export const CustomerInformationCard: React.FC<CustomerInformationCardProps> = ({ customer }) => {
  const { isRTL } = useApp();
  const { t: featureT } = useFeatureTranslations("user");

  return (
    <Card className={`p-4 ${isRTL ? 'border-r-4 border-r-blue-500' : 'border-l-4 border-l-blue-500'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-blue-100 rounded-full">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          {featureT("orderDetailsModal.customerInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <UserIcon className="h-4 w-4 text-gray-600 dark:text-white" />
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1 dark:text-white">
                  {featureT("orderDetailsModal.fullName")}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {customer?.firstName} {customer?.lastName}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <Mail className="h-4 w-4 text-gray-600 dark:text-white" />
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1 dark:text-white">
                  {featureT("orderDetailsModal.emailAddress")}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white break-all">
                  {customer?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Phone Number */}
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <CreditCard className="h-4 w-4 text-gray-600 dark:text-white" />
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1 dark:text-white">
                  {featureT("orderDetailsModal.phoneNumber")}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {customer?.phone}
                </div>
              </div>
            </div>

            {/* Registration Date */}
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1 dark:text-white">
                  {featureT("orderDetailsModal.registrationDate")}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {customer?.createdDate
                    ? formatDateOnly(customer.createdDate, isRTL)
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

