import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { useApp } from "@/shared/contexts/AppContext";
import { useAuth } from "../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useSharedTranslations, useFeatureTranslations } from "@/shared/hooks/useTranslation";

export const ResetPasswordPage: React.FC = () => {
  const { handleResetPassword, isLoading, error, handleClearError, handleSetAuthLoading } = useAuth();
  const { isRTL } = useApp();
  const { t: validationT } = useSharedTranslations("validation");
  const { t: authT } = useFeatureTranslations("auth");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { navigateToForgetPassword, navigateToSignIn } = useNavigation();
  const [isSuccess, setIsSuccess] = useState(false);

  const formSchema = z.object({
    password: z.string().min(8, validationT("password.minLength")).nonempty(validationT("password.required")),
    confirmPassword: z.string().min(8, validationT("password.minLength")).nonempty(validationT("confirmPassword.required")),
  }).refine((data) => data.password === data.confirmPassword, {
    message: validationT("password.mismatch"),
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token || !email) {
      navigateToForgetPassword();
    }
  }, [token, email]);

  useEffect(() => {
    handleClearError();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    handleSetAuthLoading(true);
    const response = await handleResetPassword({ password: data.password, password_confirmation: data.confirmPassword, token: token as string, email: email as string });
    setSuccessMessage(response.message);
    setIsSuccess(response.status === "success");
    handleSetAuthLoading(false);
  }

  if (isSuccess) {
        return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          {/* Success Message */}
          <div className="w-full max-w-md mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">{authT("resetPassword.title")}</CardTitle>
                  <p className="text-muted-foreground">
                    {authT("resetPassword.subtitle")}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {successMessage}
                    </p>
                  </div>

                  <Button 
                    onClick={navigateToSignIn}
                    className="w-full h-12 bg-amber-600 hover:bg-amber-700"
                  >
                    {authT("resetPassword.backToSignIn")}
                    {isRTL ? (
                      <ArrowLeft className="h-4 w-4 ml-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          {/* Reset Password Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">AH</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{authT("resetPassword.title")}</CardTitle>
                <p className="text-muted-foreground">
                  {email && `Email: ${String(email)}`}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">{authT("resetPassword.newPassword")}</Label>
                    <div className="relative">
                      <Lock className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={authT("resetPassword.newPasswordPlaceholder")}
                        {...form.register("password")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} h-12`}
                        required
                          minLength={8}
                        onError={(e: React.ChangeEvent<HTMLInputElement>) => form.setError("password", { message: e.target.value })}
                        />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {form.formState.errors.password && (
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{authT("resetPassword.confirmNewPassword")}</Label>
                    <div className="relative">
                      <Lock className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={authT("resetPassword.confirmNewPasswordPlaceholder")}
                        {...form.register("confirmPassword")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} h-12`}
                        required
                        minLength={8}
                        onError={(e: React.ChangeEvent<HTMLInputElement>) => form.setError("confirmPassword", { message: e.target.value })}
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{form.formState.errors.confirmPassword.message}</p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-12 bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {authT("resetPassword.setNewPassword")}
                        {isRTL ? (
                          <ArrowLeft className="h-4 w-4 ml-2" />
                        ) : (
                          <ArrowRight className="h-4 w-4 ml-2" />
                        )}
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">{authT("resetPassword.rememberPassword")} </span>
                  <Button 
                    variant="link" 
                    className="p-0 text-sm text-amber-600 hover:text-amber-700"
                    onClick={navigateToSignIn}
                  >
                    {authT("resetPassword.backToSignIn")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}