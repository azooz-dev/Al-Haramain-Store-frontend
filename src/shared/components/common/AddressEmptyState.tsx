import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';

interface AddressEmptyStateProps {
  mode: 'selection' | 'display';
  onAddAddress: () => void;
  showAddButton: boolean;
}

export const AddressEmptyState: React.FC<AddressEmptyStateProps> = ({
  mode,
  onAddAddress,
  showAddButton,
}) => {
  const { t: sharedT } = useSharedTranslations("shared");

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-amber-600" />
          {mode === 'selection' 
            ? sharedT("address.selection.title")
            : sharedT("address.display.title")
          }
        </h4>
        {showAddButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddAddress}
            className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
          >
            <Plus className="w-4 h-4" />
            {sharedT("address.selection.addNewAddress")}
          </Button>
        )}
      </div>
      
      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h4 className="font-medium mb-2 text-gray-600 dark:text-gray-400">
          {sharedT("address.display.noSavedAddresses")}
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          {mode === 'selection'
            ? sharedT("address.selection.addFirstAddress")
            : sharedT("address.display.addFirstAddress")
          }
        </p>
        <Button
          onClick={onAddAddress}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {sharedT("address.selection.addAddress")}
        </Button>
      </div>
    </div>
  );
}