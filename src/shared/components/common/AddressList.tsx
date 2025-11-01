import React from 'react';
import { MapPin, Edit, X, User, Briefcase, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { RadioGroup } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { useApp } from '@/shared/contexts/AppContext';
import { Address } from '@/shared/types';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';

interface AddressListProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onAddressSelect: (addressId: number) => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (addressId: number) => void;
  deletingAddressId: number | null;
  mode: 'selection' | 'display';
  showEditButtons: boolean;
  showDeleteButtons: boolean;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onEditAddress,
  onDeleteAddress,
  deletingAddressId,
  mode,
  showEditButtons,
  showDeleteButtons,
}) => {
  const { isRTL } = useApp();
  const { t: sharedT } = useSharedTranslations("shared");

  const getAddressTypeIcon = (addressType: string) => {
    switch (addressType.toLowerCase()) {
      case 'home':
        return <User className='w-4 h-4 text-amber-600 dark:text-amber-400'/>
      case 'work':
        return <Briefcase className='w-4 h-4 text-blue-600 dark:text-blue-400'/>
      case 'other':
        return <Globe className='w-4 h-4 text-gray-600 dark:text-gray-400'/>
      default:
        return <MapPin className='w-4 h-4 text-gray-600 dark:text-gray-400'/>
    }
  }

  const getAddressTypeLabel = (addressType: string) => {
    switch (addressType.toLowerCase()) {
      case 'home':
        return sharedT("address.type.home");
      case 'work':
        return sharedT("address.type.work");
      case 'other':
        return sharedT("address.type.other");
      default:
        return sharedT("address.type.other");
    }
  }

  if (mode === 'selection') {
    return (
      <RadioGroup
        value={selectedAddressId?.toString() || ''}
        onValueChange={(value) => onAddressSelect(parseInt(value))}
        className={`space-y-3 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {addresses.map((address) => (
          <div key={address.identifier} className="relative">
            <label
              htmlFor={`address-${address.identifier}`}
              className={`block cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedAddressId === address.identifier
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
              }`}
            >
              <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>

                {/* Avatar icon on the left */}
                <div className={`p-2 rounded-lg ${
                  address.isDefault 
                    ? 'bg-amber-100 dark:bg-amber-900/30' 
                    : 'bg-gray-100 dark:bg-gray-600'
                }`}>
                  {getAddressTypeIcon(address.addressType)}
                </div>

                {/* Content in the middle */}
                <div className="flex-1 min-w-0">
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h5 className="font-medium capitalize">
                      {getAddressTypeLabel(address.addressType)}
                    </h5>
                    {address.isDefault && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                        {isRTL ? 'افتراضي' : 'Default'}
                      </Badge>
                    )}
                  </div>
                  <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="font-medium">{address.street}</p>
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>

              {/* Action buttons on the right */}
                {(showEditButtons || showDeleteButtons) && (
                  <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {showEditButtons && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAddress(address);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </Button>
                    )}
                    {showDeleteButtons && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAddress(address.identifier);
                        }}
                        disabled={deletingAddressId === address.identifier}
                        className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {deletingAddressId === address.identifier ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4`}
      style={isRTL ? { direction: 'rtl' } : {}}
    >
      {addresses.map((address) => (
        <div key={address.identifier} className={`relative border rounded-lg p-4 ${address.isDefault ? 'border-amber-500' : ''}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              address.isDefault 
                ? 'bg-amber-100 dark:bg-amber-900/30' 
                : 'bg-gray-100 dark:bg-gray-600'
            }`}>
              {getAddressTypeIcon(address.addressType)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-medium capitalize">
                  {getAddressTypeLabel(address.addressType)}
                </h5>
                {address.isDefault && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                    {isRTL ? 'افتراضي' : 'Default'}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
            {(showEditButtons || showDeleteButtons) && (
              <div className="flex gap-1">
                {showEditButtons && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(address);
                    }}
                    className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                )}
                {showDeleteButtons && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAddress(address.identifier);
                    }}
                    disabled={deletingAddressId === address.identifier}
                    className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {deletingAddressId === address.identifier ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}