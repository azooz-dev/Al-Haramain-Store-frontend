import React from 'react';
import { Card, CardContent } from '@shared/components/ui/card';
import { AddressSelector } from '@shared/components/common/AddressSelector';

interface UserAddressesProps {
  userId: number;
}

export const UserAddresses: React.FC<UserAddressesProps> = ({ userId }) => {

    return (
    <Card className="mb-6 p-4">
      <CardContent>
        <AddressSelector
          selectedAddressId={null}
          onAddressSelect={() => {}}
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