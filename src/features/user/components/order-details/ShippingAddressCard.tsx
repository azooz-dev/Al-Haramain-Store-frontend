import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { MapPin, Home, Building, CheckCircle } from 'lucide-react';
import type { Address } from '@/shared/types';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ShippingAddressCardProps {
  address: Address;
}

export const ShippingAddressCard: React.FC<ShippingAddressCardProps> = ({ address }) => {
  const { isRTL } = useApp();
  const { t: featureT } = useFeatureTranslations("user");

  return (
    <Card className={`p-4 bg-[#0a0a0a] ${isRTL ? 'border-r-4 border-r-primary' : 'border-l-4 border-l-primary'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          {featureT("orderDetailsModal.shippingAddress")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`bg-background rounded-xl p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
              {address.addressType === 'home' ? (
                <Home className="h-5 w-5 text-primary" />
              ) : (
                <Building className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-lg text-gray-900">{address.label}</h4>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {featureT(`orderDetailsModal.addressType.${address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}`)}
                </Badge>
              </div>

              <div className="space-y-2 text-gray-700">
                <div className="font-medium text-base">{address.street}</div>
                <div className="text-sm">
                  {address.city}, {address.state} {address.postalCode}
                </div>
                <div className="text-sm font-medium text-gray-600">{address.country}</div>
              </div>

              {address.isDefault && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3" />
                  {featureT("orderDetailsModal.defaultAddress")}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

