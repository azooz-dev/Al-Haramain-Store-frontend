import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "@/shared/contexts/AppContext";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Shield, Mail, AlertCircle, RotateCcw, Timer, ArrowLeft, Badge } from "lucide-react";
import { useNavigation } from "@/shared/hooks/useNavigation";

export const OTPPage: React.FC = () => {
  const {
    error,
    handleVerifyEmail,
    handleResendOTP,
    handleClearError,
  } = useAuth();
  const { isRTL } = useApp();
  const location = useLocation();
  const email = location.state?.email;
  const { language } = useApp();
  const inputOTPRef = useRef<HTMLInputElement[]>([]);
  const { navigateToSignIn } = useNavigation();
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [resendSuccess, setResendSuccess] = useState(false);
  const messages = {
    en: {
      otpRequired: "OTP is required",
      otpInvalid: "OTP is invalid",
      otpExpired: "OTP has expired",
      otpResend: "OTP has been sent to your email",
      verificationAttemptsRequired: "Verification attempts are required",
    },
    ar: {
      otpRequired: "الكود المرسل هو مطلوب",
      otpInvalid: "الكود المرسل غير صالح",
      otpExpired: "الكود المرسل لا يزال صالح",
      otpResend: "تم إرسال الكود المرسل إلى بريدك الإلكتروني",
      verificationAttemptsRequired: "عدد المحاولات مطلوب",
    }
  };

  const t = messages[language] || messages.en;

  const formSchema = z.object({
    otp: z.string().nonempty(t.otpRequired),
    isVerifying: z.boolean(),
    isResending: z.boolean(),
    verificationAttempts: z.number().int().positive(t.verificationAttemptsRequired),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      isVerifying: false,
      isResending: false,
      verificationAttempts: 0,
    }
  });

  useEffect(() => {
    handleClearError();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimer]);

  useEffect(() => {
    if (inputOTPRef.current[0]) {
      inputOTPRef.current[0].focus();
    }
  }, [inputOTPRef]);

  const handleInputChange = (index: number, value: string) => {
    // Clear error and success messages when user starts typing
    if (error) {
      handleClearError();
    }
    if (resendSuccess) {
      setResendSuccess(false);
    }

    // only allow digits
    const digit = value.replace(/\D/g, '').slice(0, 1);
    
    // Update local state immediately for instant UI response
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    
    // Update form state
    const otp = newDigits.join('');
    form.setValue("otp", otp);

    // auto-focus next input
    if (digit && index < 5 && inputOTPRef.current[index + 1]) {
      inputOTPRef.current[index + 1].focus();
    }

    // Auto-verify when complete - check if all 6 digits are filled
    if (newDigits.every(d => d !== '')) {
      // Immediate verification for better UX
      handleVerifyOTP(otp);
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      const newDigits = [...otpDigits];
      
      if (newDigits[index]) {
        // Clear current input
        newDigits[index] = '';
      } else if (index > 0) {
        // Move to previous input and clear it
        newDigits[index - 1] = '';
        inputOTPRef.current[index - 1].focus();
      }
      
      setOtpDigits(newDigits);
      form.setValue("otp", newDigits.join(''));
    } else if (event.key === 'ArrowLeft' && index > 0) {
      // Move to previous input
      inputOTPRef.current[index - 1].focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      // Move to next input
      inputOTPRef.current[index + 1].focus();
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '') as string;
    
    if (pastedData.length === 6) {
      // Clear error when pasting
      if (error) {
        handleClearError();
      }
      
      const newDigits = pastedData.split('');
      setOtpDigits(newDigits);
      form.setValue("otp", pastedData);
      
      // Focus last input
      inputOTPRef.current[5]?.focus();
      
      // Auto-verify immediately for pasted data
      handleVerifyOTP(pastedData);
    }
  }

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, (_1: string, start: string, middle: string, end: string) => 
    start + '*'.repeat(Math.min(middle.length, 4)) + end) : 'your email';

  const handleVerifyOTP = async (otp: string) => {
    if (otp.length !== 6 || !email) return;
    
    form.setValue("isVerifying", true);
    form.setValue("verificationAttempts", form.getValues("verificationAttempts") + 1);
    
    try {
      await handleVerifyEmail({ code: otp, email: email as string });
      // Success - navigation will be handled by the auth hook
    } catch {
      // Error is handled by the auth hook and will be displayed
      form.setValue("isVerifying", false);
    }
  }

  const handleResendClick = async () => {
    if (!email) return;
    
    form.setValue("isResending", true);
    setCanResend(false);
    setResendTimer(60);
    setResendSuccess(false);
    
    try {
      await handleResendOTP({ email });
      setResendSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    } catch {
      // Error is handled by the auth hook
    } finally {
      form.setValue("isResending", false);
    }
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-amber-900/20 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-800/30 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Header Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                {isRTL ? 'التحقق من البريد الإلكتروني' : 'Email Verification'}
              </CardTitle>
              
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                  <Mail className="w-3 h-3 mr-1" />
                  {maskedEmail}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? 'أدخل رمز التحقق المكون من 6 أرقام المرسل إلى بريدك الإلكتروني'
                  : 'Enter the 6-digit verification code sent to your email'
                }
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input Fields */}
            <div className="space-y-4">
              <div className={`flex gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                {Array.from({ length: 6 }, (_, index) => (
                  <Input
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                      if (el) {
                        inputOTPRef.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[index] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 rounded-lg transition-all duration-300 bg-white/50 dark:bg-gray-700/50"
                  />
                ))}
              </div>

              {/* Error or Verification Status */}
              {error ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-600 dark:text-red-400">
                      {error}
                    </span>
                  </div>
                </div>
              ) : (form.getValues("isVerifying") && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-amber-600 dark:text-amber-400">
                      {isRTL ? 'جاري التحقق...' : 'Verifying...'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Verification Status */}
              {form.getValues("verificationAttempts") > 0 && !error && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {form.getValues("verificationAttempts") < 3 ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400">
                          {isRTL 
                            ? `محاولة ${form.getValues("verificationAttempts")} من 3`
                            : `Attempt ${form.getValues("verificationAttempts")} of 3`
                          }
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">
                          {isRTL ? 'عدد محاولات مكثفة' : 'Too many attempts'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>


            {/* Resend Code Section */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'لم تستلم الرمز؟' : "Didn't receive the code?"}
                </p>
              </div>

              {canResend ? (
                <Button
                  variant="outline"
                  onClick={handleResendClick}
                  disabled={form.getValues("isResending") || !email}
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
                >
                  {form.getValues("isResending") ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>{isRTL ? 'جاري الإرسال...' : 'Sending...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>{isRTL ? 'إرسال رمز جديد' : 'Resend Code'}</span>
                    </div>
                  )}
                </Button>
              ) : (
                <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span>
                      {isRTL 
                        ? `يمكنك طلب رمز جديد بعد ${formatTimer(resendTimer)}`
                        : `Resend available in ${formatTimer(resendTimer)}`
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Resend Success Message */}
              {resendSuccess && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <span className="text-green-600 dark:text-green-400">
                      {isRTL 
                        ? 'تم إرسال رمز جديد! يرجى مراجعة بريدك الإلكتروني'
                        : 'New code sent! Please check your email'
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={navigateToSignIn}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="ml-2">
                {isRTL ? 'العودة إلى تسجيل الدخول' : 'Back to Sign In'}
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-amber-200/50 dark:border-amber-800/30">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="mb-1 font-medium">
                {isRTL ? 'ملاحظة أمنية:' : 'Security Notice:'}
              </p>
              <p>
                {isRTL 
                  ? 'رمز التحقق صالح لمدة 10 دقائق فقط. لا تشارك هذا الرمز مع أي شخص آخر.'
                  : 'The verification code is valid for 10 minutes only. Never share this code with anyone.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}