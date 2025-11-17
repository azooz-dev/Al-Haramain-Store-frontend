import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { AddressSelector } from '@/shared/components/common/AddressSelector';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { User as UserType } from '@/features/auth/types';
import { Address, AddressFormData, UpdateAddressRequest, DeleteAddressRequest, AddressResponse, DeleteAddressResponse } from '@/shared/types';
import { ProcessedError } from '@/shared/types';

interface ShippingStepProps {
  user: UserType | null;
  selectedAddressId: number | null;
  onAddressSelect: (addressId: number) => void;
  addresses: Address[];
  isLoadingAddresses: boolean;
  isCreatingAddress: boolean;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
  createAddress: (addressData: AddressFormData) => Promise<AddressResponse>;
  updateAddress: (addressData: UpdateAddressRequest) => Promise<AddressResponse>;
  deleteAddress: (addressData: DeleteAddressRequest) => Promise<DeleteAddressResponse>;
  createAddressError: ProcessedError | undefined;
  updateAddressError: ProcessedError | undefined;
  deleteAddressError: ProcessedError | undefined;
}

export const ShippingStep: React.FC<ShippingStepProps> = ({
  user,
  selectedAddressId,
  onAddressSelect,
  addresses,
  isLoadingAddresses,
  isCreatingAddress,
  isUpdatingAddress,
  isDeletingAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  createAddressError,
  updateAddressError,
  deleteAddressError,
}) => {
  const { t: featureT } = useFeatureTranslations("orders");

    return (
    <div className="space-y-6">
      {/* User Information Display */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <User className="h-5 w-5 text-amber-600" />
          {featureT("shippingStep.userInformation.title")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{featureT("shippingStep.userInformation.name")}:</span>
            <span>{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{featureT("shippingStep.userInformation.email")}:</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{featureT("shippingStep.userInformation.phone")}:</span>
            <span>{user?.phone}</span>
          </div>
        </div>
      </div>
      
      {/* Address Selection */}
      <AddressSelector
        selectedAddressId={selectedAddressId}
        onAddressSelect={onAddressSelect}
        userId={user?.identifier || 0}
        showAddButtons={true}
        showEditButtons={true}
        showDeleteButtons={true}
        mode="selection"
        addresses={addresses}
        isLoadingAddresses={isLoadingAddresses}
        isCreatingAddress={isCreatingAddress}
        isUpdatingAddress={isUpdatingAddress}
        isDeletingAddress={isDeletingAddress}
        createAddress={createAddress}
        updateAddress={updateAddress}
        deleteAddress={deleteAddress}
        createAddressError={createAddressError}
        updateAddressError={updateAddressError}
        deleteAddressError={deleteAddressError}
      />
    </div>
  );
}