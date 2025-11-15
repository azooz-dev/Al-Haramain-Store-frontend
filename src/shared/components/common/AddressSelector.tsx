import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useApp } from '@/shared/contexts/AppContext';
import { AddressForm } from './AddressForm';
import { AddressList } from './AddressList';
import { AddressEmptyState } from './AddressEmptyState';
import { Address, AddressFormData, DeleteAddressRequest, UpdateAddressRequest } from '@/shared/types';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';

interface AddressSelectorProps {
  selectedAddressId: number | null;
  onAddressSelect: (addressId: number) => void;
  addresses: Address[];
  isLoadingAddresses: boolean;
  isCreatingAddress: boolean;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
  createAddress: (addressData: AddressFormData) => void;
  updateAddress: (addressData: UpdateAddressRequest) => void;
  deleteAddress: (addressData: DeleteAddressRequest) => void;
  userId: number;
  showAddButtons: boolean;
  showEditButtons: boolean;
  showDeleteButtons: boolean;
  mode: 'selection' | 'display';
  className?: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
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
  userId,
  showAddButtons,
  showEditButtons,
  showDeleteButtons,
  mode,
  className,
}) => {
  const { isRTL } = useApp();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { t: sharedT } = useSharedTranslations("shared");

  const handleDeleteAddress = async (addressId: number) => {
    await deleteAddress({ addressId, userId });
  }

  const handleEditAddress = (address: Address) => {
    setIsAddressFormOpen(true);
    setEditingAddress(address);
  }

  const handleCloseAddressForm = () => {
    setIsAddressFormOpen(false);
    setEditingAddress(null);
  }

  const handleOpenAddressForm = () => {
    setIsAddressFormOpen(true);
  }

  if (isLoadingAddresses) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h4 className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="h-5 w-5 text-amber-600" />
            {mode === 'selection' 
              ? sharedT("address.selection.title")
              : sharedT("address.display.title")
            }
          </h4>
          {showAddButtons && (
            <Skeleton className="h-9 w-24" />
          )}
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (addresses && addresses?.length === 0) {
    return (
      <div className={className}>
        <AddressEmptyState
          mode={mode}
          onAddAddress={handleOpenAddressForm}
          showAddButton={showAddButtons}
        />
        
        <AddressForm
          isOpen={isAddressFormOpen}
          onClose={() => {
            handleCloseAddressForm();
            setEditingAddress(null);
          }}
          createAddress={createAddress}
          updateAddress={updateAddress}
          isCreatingAddress={isCreatingAddress}
          isUpdatingAddress={isUpdatingAddress}
          editingAddress={editingAddress}
          userId={userId} 
          onSuccess={() => {
            // Address will be automatically updated in the list via the query
            handleCloseAddressForm();
          }}
        />
      </div>
    );
  }

    return (
    <div className={`space-y-4 ${className}`}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h4 className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MapPin className="h-5 w-5 text-amber-600" />
          {mode === 'selection' 
            ? sharedT("address.selection.title")
            : sharedT("address.display.title")
          }
        </h4>
        {showAddButtons && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAddressForm}
            className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
          >
            <Plus className="w-4 h-4" />
            {sharedT("address.selection.addNewAddress")}
          </Button>
        )}
      </div>

      <div className="transition-all duration-300 ease-in-out">
        <AddressList
          addresses={addresses || []}
          selectedAddressId={selectedAddressId}
          onAddressSelect={onAddressSelect}
          onEditAddress={handleEditAddress}
          onDeleteAddress={handleDeleteAddress}
          isDeletingAddress={isDeletingAddress}
          mode={mode}
          showEditButtons={showEditButtons}
          showDeleteButtons={showDeleteButtons}
        />
      </div>

      <AddressForm
        isOpen={isAddressFormOpen}
        onClose={() => {
          handleCloseAddressForm();
          setEditingAddress(null);
        }}
        editingAddress={editingAddress}
        userId={userId}
        createAddress={createAddress}
        updateAddress={updateAddress}
        isCreatingAddress={isCreatingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onSuccess={() => {
          handleCloseAddressForm();
        }}
      />
    </div>
  );
}