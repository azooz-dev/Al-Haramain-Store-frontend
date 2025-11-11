import React, { useState } from 'react';
import { User as UserIcon, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader } from '@shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ButtonSpinner } from '@/shared/components/ui/spinner';
import type { User } from '@/features/auth/types';
import { useUsers } from '../hooks/useUsers';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { isRTL } = useApp();
  const { t: userT } = useFeatureTranslations('user');
  const { t: validationT } = useSharedTranslations("validation");
  const {
    updateUser,
    isUpdatingUser,
  } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const isLoading = isUpdatingUser;

  const formSchema = z.object({
    firstName: z.string().nonempty(validationT("firstName.required")),
    lastName: z.string().nonempty(validationT("lastName.required")),
    phone: z.string().nonempty(validationT("phone.required")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone.toString(),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    const changedFields = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => user[key as keyof User] !== value
      )
    );
    await updateUser({
      userId: user.identifier,
      data: changedFields,
    });
    setIsEditing(false);
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone.toString(),
    });
  }

    return (
    <Card className="mb-6 p-4">
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <UserIcon className="h-6 w-6 text-amber-600" />
          {userT("profile.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Form */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4`}
          style={isRTL ? { direction: 'rtl' } : undefined}
        >
          <div className="space-y-2">
            <Label htmlFor="firstName">{ userT("profile.firstName") }</Label>
            <Input
              id="firstName"
              {...form.register('firstName')}
              disabled={!isEditing}
              className={`${isRTL ? 'text-right rtl' : 'text-left ltr'} ${form.formState.errors.firstName ? 'border-red-500' : ''
                }`}
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{ userT("profile.lastName") }</Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              disabled={!isEditing}
              className={`${isRTL ? 'text-right rtl' : 'text-left ltr'} ${form.formState.errors.lastName ? 'border-red-500' : ''
                }`}
              dir={isRTL ? 'rtl' : 'ltr'} inputMode={isRTL ? 'text' : undefined}
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{ userT("profile.phone") }</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register('phone')}
              disabled={!isEditing}
              className={`${isRTL ? 'text-right rtl' : 'text-left ltr'} ${form.formState.errors.phone ? 'border-red-500' : ''
                }`}
              dir={isRTL ? 'rtl' : 'ltr'} inputMode={isRTL ? 'text' : undefined}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {userT("profile.edit")}
            </Button>
          ) : (
            <>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <ButtonSpinner />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading
                  ? userT("profile.saving")
                  : userT("profile.save")
                }
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                {userT("profile.cancel")}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}