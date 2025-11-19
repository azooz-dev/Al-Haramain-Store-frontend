import React from 'react';
import { Card, CardContent } from '@shared/components/ui/card';
import { AddressSelector } from '@shared/components/common/AddressSelector';
import { useAddress } from '@/shared/hooks/useAddress';
import { Address, AddressFormData, AddressResponse, UpdateAddressRequest, DeleteAddressRequest, DeleteAddressResponse } from '@/shared/types';

interface UserAddressesProps {
  userId: number;
}

export const UserAddresses: React.FC<UserAddressesProps> = ({ userId }) => {
  const {
    addresses,
    isLoadingAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddress() as {
    addresses: Address[];
    isLoadingAddresses: boolean;
    createAddress: (addressData: AddressFormData) => Promise<AddressResponse>;
    updateAddress: (addressData: UpdateAddressRequest) => Promise<AddressResponse>;
    deleteAddress: (addressData: DeleteAddressRequest) => Promise<DeleteAddressResponse>;
    isCreatingAddress: boolean;
    isUpdatingAddress: boolean;
    isDeletingAddress: boolean;
  };

    return (
    <Card className="mb-6 p-4">
      <CardContent>
        <AddressSelector
          selectedAddressId={null}
          onAddressSelect={() => {}}
          addresses={addresses}
          isLoadingAddresses={isLoadingAddresses}
          isCreatingAddress={isCreatingAddress}
          isUpdatingAddress={isUpdatingAddress}
          isDeletingAddress={isDeletingAddress}
          createAddress={createAddress}
          updateAddress={updateAddress}
          deleteAddress={deleteAddress}
          userId={userId}
          showAddButtons={true}
          showEditButtons={true}
          showDeleteButtons={true}
          mode="display"
        />
      </CardContent>
    </Card>
  );
}