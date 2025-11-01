import React from 'react';
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
    country: z.string().nonempty(validationT("required"))
        .min(2, validationT("form.tooShort", { min: 2 }))
      .max(3, validationT("form.tooLong", { max: 3 })),
    isDefault: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: editingAddress?.label || '',
      addressType: editingAddress?.addressType as 'Home' | 'Work' | 'Other' || 'Home',
      street: editingAddress?.street || '',
      city: editingAddress?.city || '',
      state: editingAddress?.state || '',
      postalCode: editingAddress?.postalCode || '',
      country: editingAddress?.country || '',
      isDefault: editingAddress?.isDefault || false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (editingAddress) {
      await updateAddress({
        userId,
        addressId: editingAddress.identifier,
        data: {
          ...data,
          label: data.label,
          addressType: data.addressType,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          isDefault: data.isDefault,
        },
      });
      onSuccess?.();
    } else {
      await createAddress({ ...data, isDefault: data.isDefault ?? false });
      onSuccess?.();
    }
  }

  const isLoading = isCreatingAddress || isUpdatingAddress;

  const setFormData = React.useCallback((value: React.SetStateAction<AddressFormData>) => {
    const current = { ...form.getValues(), isDefault: form.getValues().isDefault ?? false } as AddressFormData;
    const newValue = typeof value === 'function' ? value(current) : value;
    (Object.keys(newValue) as Array<keyof AddressFormData>).forEach((key) => {
      form.setValue(key, newValue[key]);
    });
  }, [form]);

  const formContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary mb-4">
        <MapPin className="w-5 h-5" />
        <h3 className="font-semibold">
          {editingAddress 
            ? sharedT("address.editAddress")
            : sharedT("address.addAddress")
          }
        </h3>
      </div>

      <AddressFormFields
        formData={{ ...form.getValues(), isDefault: form.getValues().isDefault ?? false } as AddressFormData}
        setFormData={setFormData}
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
          <DialogTitle className="flex items-center gap-2">
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