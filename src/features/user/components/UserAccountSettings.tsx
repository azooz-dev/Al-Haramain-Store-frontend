import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Check, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { ConfirmDialog } from '@shared/components/common/ConfirmDialog';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/features/auth/types';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProcessedError } from '@/shared/types';
import { UpdateUserRequest, DeleteUserRequest, DeleteUserResponse } from '../types';


interface UserAccountSettingsProps {
  user: User;
}

export const UserAccountSettings: React.FC<UserAccountSettingsProps> = ({
  user
}) => {
  const { isRTL } = useApp();
  const { t: userT } = useFeatureTranslations('user');
  const { t: validationT } = useSharedTranslations("validation");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { updateUser, isUpdatingUser, deleteUser, isDeletingUser, updateUserError } = useUsers() as {
    updateUser: (payload: UpdateUserRequest) => Promise<User | string>;
    isUpdatingUser: boolean;
    deleteUser: (payload: DeleteUserRequest) => Promise<DeleteUserResponse>;
    isDeletingUser: boolean;
    updateUserError: ProcessedError | undefined;
  };
  const { handleSignOut } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z.object({
    email: z.string().email(validationT("email.invalid")).nonempty(validationT("email.required")),
    password: z.string().min(8, validationT("password.minLength", { min: 8 })).nonempty(validationT("password.required")),
    newPassword: z.string().min(8, validationT("password.minLength", { min: 8 })).nonempty(validationT("password.required")),
    newPasswordConfirmation: z.string().min(8, validationT("password.minLength", { min: 8 })).nonempty(validationT("password.required")),
  }).refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: validationT("password.mismatch"),
    path: ["newPasswordConfirmation"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: user.email,
      password: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }

  const handleEmailChange = async () => {
    const response = await updateUser({
      userId: user.identifier,
      data: {
        email: form.getValues("email"),
      },
    });
    if (typeof response !== "string") {
      await handleSignOut();
    } else {
      setIsDialogOpen(false);
    }
  }

  const handleEmailSaveClick = () => {
    setIsDialogOpen(true);
  }

  const handlePasswordChange = async (data: z.infer<typeof formSchema>) => {
    setSuccessMessage("");
    const response = await updateUser({
      userId: user.identifier,
      data: {
        current_password: data.password,
        password: data.newPassword,
        password_confirmation: data.newPasswordConfirmation,
      },
    });
    if (typeof response !== "string") {
      setSuccessMessage(userT("accountSettings.passwordChanged"));
      setIsChangingPassword(false);
      form.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }

  const handleDeleteAccount = async () => {
    const response = await deleteUser({ userId: user.identifier });
    if (response.data) {
			await handleSignOut();
		}
	};

    return (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Mail className="w-5 h-5" />
            {userT("accountSettings.email")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {updateUserError && isEditingEmail && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {updateUserError.data?.message}
              </AlertDescription>
            </Alert>
          )}
          {isEditingEmail ? (
            <div className="space-y-4">
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="new-email" className={`${isRTL ? 'flex-row-reverse' : ''}`}>{userT("accountSettings.newEmail")}</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={form.watch("email")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("email", e.target.value)}
                  className={isRTL ? 'text-right' : 'text-left'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  placeholder={userT("accountSettings.newEmailPlaceholder")}
                />
              </div>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleEmailSaveClick}
                  disabled={isUpdatingUser}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  {isUpdatingUser ? ( 
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {userT("accountSettings.save")}
                    </>
                  )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingEmail(false);
                      form.reset();
                    }}
                    className={`${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <X className="h-4 w-4" />
                    <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{userT("accountSettings.cancel")}</span>
                  </Button>

              </div>
            </div>
          ) : (
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {userT("accountSettings.currentEmail")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingEmail(true);
                }}
              >
                {userT("accountSettings.change")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Lock className="w-5 h-5" />
            {userT("accountSettings.password")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage && !isChangingPassword &&  (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          {updateUserError && isChangingPassword && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {updateUserError.data?.message}
              </AlertDescription>
            </Alert>
          )}
          {!isChangingPassword ? (
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium">••••••••</p>
                <p className="text-sm text-muted-foreground">
                  {userT("accountSettings.lastUpdated")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(true);
                  setSuccessMessage("");
                }}
              >
                {userT("accountSettings.change")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Password */}
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="current-password" className={`${isRTL ? 'flex-row-reverse' : ''}`}>{userT("accountSettings.currentPassword")}</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    {...form.register("password")}
                    type={showCurrentPassword ? "text" : "password"}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} ${form.formState.errors.password ? 'border-red-500' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={userT("accountSettings.currentPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="new-password" className={`${isRTL ? 'flex-row-reverse' : ''}`}>{userT("accountSettings.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    {...form.register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} ${form.formState.errors.newPassword ? 'border-red-500' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={userT("accountSettings.newPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.newPassword && (
                  <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                    {form.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="confirm-password" className={`${isRTL ? 'flex-row-reverse' : ''}`}>{userT("accountSettings.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    {...form.register("newPasswordConfirmation")}
                    type={showConfirmPassword ? "text" : "password"}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} ${form.formState.errors.newPasswordConfirmation ? 'border-red-500' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={userT("accountSettings.newPasswordConfirmationPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.newPasswordConfirmation && (
                  <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                    {form.formState.errors.newPasswordConfirmation.message}
                  </p>
                )}
              </div>

              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={form.handleSubmit(handlePasswordChange)}
                  disabled={isUpdatingUser}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 dark:text-white"
                >
                  {isUpdatingUser ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {userT("accountSettings.update")}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    form.reset();
                    form.clearErrors();
                    setSuccessMessage("");
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  disabled={isUpdatingUser}
                  className={`${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <X className="h-4 w-4" />
                  <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{userT("accountSettings.cancel")}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      {/* Email Warning Dialog */}
      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleEmailChange}
        title={userT("accountSettings.emailChangeConfirmation")}
        description={userT("accountSettings.emailChangeConfirmationDescription")}
        confirmText={userT("accountSettings.continueAndLogout")}
        cancelText={userT("accountSettings.cancel")}
        variant="warning"
        isLoading={isUpdatingUser}
      />
      </Card>

      {/* Delete Account */}
      <Card className="border-red-200 dark:border-red-800 p-4">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-5 h-5 text-red-600" />
            {userT("accountSettings.deleteAccount")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {userT("accountSettings.deleteAccountDescription")}
          </p>
          
          <Button variant="destructive" size="sm" className="w-full" onClick={handleDeleteAccount}>
            {isDeletingUser ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {userT("accountSettings.delete")}
                </>
              )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
