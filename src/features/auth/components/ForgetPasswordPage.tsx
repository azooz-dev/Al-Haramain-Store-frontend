import React, { useEffect, useState } from "react";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { useApp } from "@/shared/contexts/AppContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const ForgetPasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { handleForgetPassword, isLoading, error, handleClearError } = useAuth();
  const { isRTL } = useApp();
  const { navigateToSignIn } = useNavigation();

  const messages = {
    en: {
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
    },
    ar: {
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "البريد الإلكتروني غير صالح",
    }
  };
  const { language } = useApp();
  const t = messages[language] || messages.en;

  const formSchema = z.object({
    email: z.string().email(t.emailInvalid).nonempty(t.emailRequired),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    handleClearError();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await handleForgetPassword(data);
    setSuccessMessage(response.message);
    setIsSuccess(response.status === "success");
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
                  <CardTitle className="text-2xl">{isRTL ? 'تم إرسال البريد الإلكتروني!' : 'Email sent!'}</CardTitle>
                  <p className="text-muted-foreground">
                    {isRTL ? 'لقد أرسلنا تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' : 'We have sent password reset instructions to your email'}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {successMessage}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={navigateToSignIn}
                      className="w-full h-12 bg-amber-600 hover:bg-amber-700"
                    >
                      {isRTL ? 'العودة إلى تسجيل الدخول' : 'Back to Sign In'}
                      {isRTL ? (
                        <ArrowLeft className="h-4 w-4 ml-2" />
                      ) : (
                        <ArrowRight className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsSuccess(false);
                        form.reset();
                      }}
                      className="w-full h-12"
                    >
                      {isRTL ? 'حاول بريد إلكتروني آخر' : 'Try different email'}
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

    return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          {/* Forgot Password Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">AH</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}</CardTitle>
                <p className="text-muted-foreground">
                  {isRTL ? 'يرجى إدخال بريدك الإلكتروني لإعادة تعيين كلمة المرور' : 'Please enter your email to reset your password'}
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
                    <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <div className="relative">
                      <Mail className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                        {...form.register("email")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12`}
                        required
                        onError={(e: React.ChangeEvent<HTMLInputElement>) => form.setError("email", { message: e.target.value })}
                        />
                    </div>
                    {form.formState.errors.email && (
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{form.formState.errors.email.message}</p>
                    )}
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
                        {isRTL ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}
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
                  <span className="text-sm text-muted-foreground">{isRTL ? 'هل تذكرت كلمة المرور؟' : 'Remember password?'} </span>
                  <Button 
                    variant="link" 
                    className="p-0 text-sm text-amber-600 hover:text-amber-700"
                    onClick={navigateToSignIn}
                  >
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
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