import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Check, Trash2 } from 'lucide-react';
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
  const { updateUser, isUpdatingUser, deleteUser, isDeletingUser } = useUsers();
  const { handleSignOut } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const formSchema = z.object({
    email: z.string().email(validationT("email.invalid")).nonempty(validationT("email.required")),
    password: z.string().min(8, validationT("password.minLength")).nonempty(validationT("password.required")),
    confirmPassword: z.string().min(8, validationT("password.minLength")).nonempty(validationT("password.required")),
    newPassword: z.string().min(8, validationT("password.minLength")).nonempty(validationT("password.required")),
    newPasswordConfirmation: z.string().min(8, validationT("password.minLength")).nonempty(validationT("password.required")),
  }).refine((data) => data.password === data.confirmPassword && data.newPassword === data.newPasswordConfirmation, {
    message: validationT("password.mismatch"),
    path: ["confirmPassword", "newPassword", "newPasswordConfirmation"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    setEmailError("");
    const response = await updateUser({
      userId: user.identifier,
      data: {
        email: form.getValues("email"),
      },
    });
    if (typeof response !== "string") {
      await handleSignOut();
    } else {
      setEmailError(response);
      setIsDialogOpen(false);
    }
  }

  const handleEmailSaveClick = () => {
    setEmailError("");
    setIsDialogOpen(true);
  }

  const handlePasswordChange = async () => {
    setPasswordError("");
    setSuccessMessage("");
    const response = await updateUser({
      userId: user.identifier,
      data: {
        password: form.getValues("newPassword"),
        password_confirmation: form.getValues("newPasswordConfirmation"),
      },
    });
    if (typeof response !== "string") {
      setSuccessMessage(userT("accountSettings.passwordChanged"));
      setIsChangingPassword(false);
      form.reset();
    } else {
      setPasswordError(response);
    }
  }

  const handleDeleteAccount = async () => {
    const response = await deleteUser({ userId: user.identifier });
    if (response) {
			await handleSignOut();
		}
	};

    return (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Mail className="w-5 h-5" />
            {userT("accountSettings.email")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailError && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {emailError}
              </AlertDescription>
            </Alert>
          )}
          {isEditingEmail ? (
            <div className="space-y-4">
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="new-email">{userT("accountSettings.newEmail")}</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={form.getValues("email")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("email", e.target.value)}
                  className={isRTL ? 'text-right' : 'text-left'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  placeholder={userT("accountSettings.newEmailPlaceholder")}
                />
              </div>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={form.handleSubmit(handleEmailSaveClick)}
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
                  setEmailError("");
                }}
              >
                {userT("accountSettings.change")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Lock className="w-5 h-5" />
            {userT("accountSettings.password")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage && !isChangingPassword && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          {passwordError && isChangingPassword && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {passwordError}
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
                  setPasswordError("");
                }}
              >
                {userT("accountSettings.change")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {userT("accountSettings.passwordChangeConfirmation")}
                </AlertDescription>
              </Alert>

              {/* Current Password */}
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="current-password">{userT("accountSettings.currentPassword")}</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type="password"
                    value={form.getValues("password")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("password", e.target.value)}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={userT("accountSettings.currentPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("password", form.getValues("password") === "password" ? "text" : "password")}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                  >
                    {form.getValues("password") === "password" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="new-password">{userT("accountSettings.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type="password"
                    value={form.getValues("newPassword")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("newPassword", e.target.value)}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={userT("accountSettings.newPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("newPassword", form.getValues("newPassword") === "password" ? "text" : "password")}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                  >
                    {form.getValues("newPassword") === "password" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Label htmlFor="confirm-password">{userT("accountSettings.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={form.getValues("newPasswordConfirmation")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("newPasswordConfirmation", e.target.value)}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={userT("accountSettings.newPasswordConfirmationPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("newPasswordConfirmation", form.getValues("newPasswordConfirmation") === "password" ? "text" : "password")}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                  >
                    {form.getValues("newPasswordConfirmation") === "password" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={form.handleSubmit(handlePasswordChange)}
                  disabled={isUpdatingUser}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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
                    setSuccessMessage("");
                    setPasswordError("");
                  }}
                  disabled={isUpdatingUser}
                >
                  {userT("accountSettings.cancel")}
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
      <Card className="border-red-200 dark:border-red-800">
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
