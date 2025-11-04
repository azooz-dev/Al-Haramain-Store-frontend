import React, { useEffect } from 'react';
import { MapPin, Save, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Address, AddressFormData } from '@/shared/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useAddress } from '@/shared/hooks/useAddress';
import { AddressFormFields } from './AddressFormFields';

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress?: Address | null;
  userId: number;
  onSuccess?: () => void;
  mode?: 'modal' | 'inline';
  className?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  onClose,
  editingAddress,
  userId,
  onSuccess,
  mode = 'modal',
  className,
}) => {
  const { t: sharedT } = useSharedTranslations("shared");
  const { t: validationT } = useSharedTranslations("validation");
  const { createAddress, updateAddress, isCreatingAddress, isUpdatingAddress } = useAddress();

  const formSchema = z.object({
    label: z.string().nonempty(validationT("required")),
    addressType: z.enum(['Home', 'Work', 'Other']),
    street: z.string().nonempty(validationT("required")),
    city: z.string().nonempty(validationT("required")),
    state: z.string().nonempty(validationT("required")),
    postalCode: z.string().nonempty(validationT("required"))
        .regex(/^\d{4,5}$/, validationT("form.invalidFormat")),
    country: z.string().nonempty(validationT("required")),
    isDefault: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      addressType: 'Home',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false,
    },
  });

  // Reset form when editingAddress changes
  useEffect(() => {
    if (editingAddress) {
      form.reset({
        label: editingAddress.label || '',
        addressType: editingAddress.addressType as 'Home' | 'Work' | 'Other' || 'Home',
        street: editingAddress.street || '',
        city: editingAddress.city || '',
        state: editingAddress.state || '',
        postalCode: editingAddress.postalCode || '',
        country: editingAddress.country || '',
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      // Reset to empty form for new address
      form.reset({
        label: '',
        addressType: 'Home',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false,
      });
    }
  }, [editingAddress, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (editingAddress) {
      // Gather only the changed fields (based on editingAddress keys, not static list)
      const changedFields = Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) => editingAddress?.[key as keyof typeof data] !== value
        )
      );
      await updateAddress({
        userId,
        addressId: editingAddress.identifier,
        data: {
          ...changedFields,
        },
      });
      onSuccess?.();
    } else {
      await createAddress({ ...data, isDefault: data.isDefault ?? false });
      onSuccess?.();
    }
  }

  const isLoading = isCreatingAddress || isUpdatingAddress;

  // Watch form values to get reactive updates
  const watchedValues = form.watch();
  
  const setFormData = React.useCallback((value: React.SetStateAction<AddressFormData>) => {
    const current = { ...watchedValues, isDefault: watchedValues.isDefault ?? false } as AddressFormData;
    const newValue = typeof value === 'function' ? value(current) : value;
    (Object.keys(newValue) as Array<keyof AddressFormData>).forEach((key) => {
      form.setValue(key, newValue[key]);
    });
  }, [form, watchedValues]);

  // Use watched values for formData
  const formData = React.useMemo(() => ({
    ...watchedValues,
    isDefault: watchedValues.isDefault ?? false
  } as AddressFormData), [watchedValues]);

  const formContent = (
    <div className="space-y-4">
      <AddressFormFields
        formData={formData}
        setFormData={setFormData}
        disabled={isLoading}
      />

      {/* Error Display */}
      {Object.keys(form.formState.errors).length > 0 && (
        <div className="text-red-600 text-sm space-y-1">
          {Object.values(form.formState.errors).map((error, index) => (
            <div key={index}>{error.message as string}</div>
          )) as React.ReactNode[]}
        </div>
      )}
    </div>
  );

  if (mode === 'inline') {
    return (
      <div className={className}>
        {formContent}
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            {sharedT("address.cancel")}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {sharedT("address.save")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mt-4">
            <MapPin className="w-5 h-5" />
            {editingAddress 
              ? sharedT("address.editAddress")
              : sharedT("address.addAddress")
            }
          </DialogTitle>
          <DialogDescription>
            {editingAddress 
              ? sharedT("address.editAddressDescription")
              : sharedT("address.addAddressDescription")
            }
          </DialogDescription>
        </DialogHeader>

        {formContent}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            {sharedT("address.cancel")}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading 
              ? sharedT("address.saving")
              : !editingAddress 
                ? sharedT("address.addAddress")
                : sharedT("address.updateAddress")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}