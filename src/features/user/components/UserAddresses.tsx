import React from 'react';
import { Card, CardContent } from '@shared/components/ui/card';
import { AddressSelector } from '@shared/components/common/AddressSelector';
import { useAddress } from '@/shared/hooks/useAddress';

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
    isDeletingAddress
  } = useAddress();

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