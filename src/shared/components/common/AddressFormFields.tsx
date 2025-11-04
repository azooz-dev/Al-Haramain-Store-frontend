import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { useApp } from '@/shared/contexts/AppContext';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { AddressFormData } from '@/shared/types';

interface AddressFormFieldsProps {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  disabled?: boolean;
}

export const AddressFormFields: React.FC<AddressFormFieldsProps> = ({
  formData,
  setFormData,
  disabled = false,
}) => {
  const { isRTL } = useApp();
  const { t: sharedT } = useSharedTranslations("shared");

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

    const addressTypes = [
    { value: 'Home', label: sharedT("address.type.home") },
    { value: 'Work', label: sharedT("address.type.work") },
    { value: 'Other', label: sharedT("address.type.other") },
  ];

    return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <Label htmlFor="label">{sharedT("address.label")}</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
          disabled={disabled}
          placeholder={sharedT("address.labelPlaceholder")}
        />
      </div>

      {/* Address Type */}
      <div>
        <Label>{sharedT("address.type.label")}</Label>
        <RadioGroup
          value={formData.addressType}
          onValueChange={(value) => {
            handleInputChange('addressType', value);
          }}
          disabled={disabled}
          className="flex flex-wrap gap-4"
          >
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-4`} >

          {addressTypes.map((type) => (
            <div key={type.value} className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <RadioGroupItem 
                value={type.value} 
                id={`addressType-${type.value}`}
                disabled={disabled}
                className={`${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              />
              <Label 
                htmlFor={`addressType-${type.value}`}
                className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              >
                {type.label}
              </Label>
            </div>
          ))}
            </div>
        </RadioGroup>
      </div>

      {/* Street Address */}
      <div>
        <Label htmlFor="street">{sharedT("address.street")}</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          disabled={disabled}
          placeholder={sharedT("address.streetPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <Label htmlFor="city">{sharedT("address.city")}</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            disabled={disabled}
            placeholder={sharedT("address.cityPlaceholder")}
          />
        </div>

        {/* State */}
        <div>
          <Label htmlFor="state">{sharedT("address.state")}</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            disabled={disabled}
            placeholder={sharedT("address.statePlaceholder")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Postal Code */}
        <div>
          <Label htmlFor="postalCode">{sharedT("address.postalCode")}</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            disabled={disabled}
            className={isRTL ? 'text-right' : 'text-left'}
            placeholder={sharedT("address.postalCodePlaceholder")}
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country">{sharedT("address.country")}</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            disabled={disabled}
            className={isRTL ? 'text-right' : 'text-left'}
            placeholder={sharedT("address.countryPlaceholder")}
          />
        </div>
      </div>

      {/* Default Address */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => handleInputChange('isDefault', e.target.checked)}
          disabled={disabled}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isDefault">
          {sharedT("address.default")}
        </Label>
      </div>
    </div>
  );
}