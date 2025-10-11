import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, User, Phone } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Separator } from "@shared/components/ui/separator";
import { Label } from "@shared/components/ui/label";
import { Input } from "@shared/components/ui/input";
import { useApp } from "@/shared/contexts/AppContext";
import { useAuth } from "../hooks/useAuth";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from "@/shared/hooks/useNavigation";
import { ImageWithFallback } from "@shared/components/common/ImageWithFallback";
import { useSharedTranslations, useFeatureTranslations } from "@/shared/hooks/useTranslation";

export const SignUpPage: React.FC = () => {
  const { isLoading, error, handleSignUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { isRTL } = useApp();
  const { navigateToSignIn } = useNavigation();
  const { t: validationT } = useSharedTranslations("validation");
  const { t: authT } = useFeatureTranslations("auth");

  const formSchema = z.object({
    firstName: z.string().nonempty(validationT("firstName.required")),
    lastName: z.string().nonempty(validationT("lastName.required")),
    email: z.string().nonempty(validationT("email.required")).email(validationT("email.invalid")),
    phone: z.string().nonempty(validationT("phone.required")),
    password: z.string().nonempty(validationT("password.required")).min(8, validationT("password.minLength")),
    password_confirmation: z.string().nonempty(validationT("password.required")).min(8, validationT("password.minLength")),
    terms: z.boolean().refine((data) => data, { message: validationT("terms.required") })
  }).refine((data) => data.password === data.password_confirmation, {
    message: validationT("password.mismatch"),
    path: ["password_confirmation"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      terms: false
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await handleSignUp({
      ...data,
      phone: parseInt(data.phone)
    });
  }

    return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Sign Up Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1">
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">AH</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{authT("signUp.title")}</CardTitle>
                <p className="text-muted-foreground">
                  {isRTL ? "انضم إلى الحرمين واكتشف المنتجات الإسلامية الأصيلة" : "Join Al-Haramain and discover authentic Islamic products"}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{authT("signUp.firstName")} *</Label>
                      <div className="relative">
                        <User className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder={authT("signUp.firstNamePlaceholder")}
                          {...form.register("firstName")}
                          className={`dark:bg-[#121212] ${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12`}
                          required
                        />
                      </div>
                      {form.formState.errors.firstName && (
                        <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{authT("signUp.lastName")} *</Label>
                      <div className="relative">
                        <User className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder={authT("signUp.lastNamePlaceholder")}
                          {...form.register("lastName")}
                          className={`dark:bg-[#121212] ${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12`}
                          required
                        />
                      </div>
                      {form.formState.errors.lastName && (
                        <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{authT("signUp.email")} *</Label>
                    <div className="relative">
                      <Mail className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder={authT("signUp.emailPlaceholder")}
                        {...form.register("email")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12`}
                        required
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{authT("signUp.phone")}</Label>
                    <div className="relative">
                      <Phone className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={authT("signUp.phonePlaceholder")}
                        {...form.register("phone")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12`}
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{authT("signUp.password")} *</Label>
                    <div className="relative">
                      <Lock className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={authT("signUp.passwordPlaceholder")}
                        {...form.register("password")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} h-12`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
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
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{authT("signUp.confirmPassword")} *</Label>
                    <div className="relative">
                      <Lock className={`h-4 w-4 absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="confirmPassword"
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        placeholder={authT("signUp.confirmPasswordPlaceholder")}
                        {...form.register("password_confirmation")}
                        className={`dark:bg-[#121212] ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} h-12`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} p-0 h-4 w-4`}
                      >
                        {showPasswordConfirmation ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {form.formState.errors.password_confirmation && (
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {form.formState.errors.password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className={`flex gap-2 space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <input
                        type="checkbox"
                        id="terms"
                        checked={form.watch("terms")}
                        onChange={e => form.setValue("terms", e.target.checked)}
                        className="mt-1 rounded border-gray-300"
                      />
                      <label htmlFor="terms" className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                        {authT("signUp.terms")}{' '}
                        <Button variant="link" className="p-0 text-sm text-amber-600 hover:text-amber-700">
                          {authT("signUp.terms")}
                        </Button>{' '}
                        {isRTL ? '' : 'and'}{' '}
                        <Button variant="link" className="p-0 text-sm text-amber-600 hover:text-amber-700">
                          {authT("signUp.privacyPolicy")}
                        </Button>
                      </label>
                    </div>
                    {form.formState.errors.terms && (
                      <p className={`text-red-500 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {form.formState.errors.terms.message}
                      </p>
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
                        {authT("signUp.createAccount")}
                        {isRTL ? (
                          <ArrowLeft className="h-4 w-4 ml-2" />
                        ) : (
                          <ArrowRight className="h-4 w-4 ml-2" />
                        )}
                      </>
                    )}
                  </Button>
                </form>

                <div className="space-y-4">
                  <div className="relative">
                    <Separator />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
                      {authT("signUp.orSignUpWith")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-11">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-11">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">{authT("signUp.alreadyHaveAccount")} </span>
                    <Button 
                      variant="link" 
                      className="p-0 text-sm text-amber-600 hover:text-amber-700"
                      onClick={navigateToSignIn}
                    >
                      {authT("signUp.signInHere")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Hero Image */}
          <div className="hidden lg:block order-1 lg:order-2">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1580638032021-8f02e0b7d741?w=600&h=800&fit=crop"
                alt="Islamic Architecture"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
              <div className={`absolute bottom-8 ${isRTL ? 'right-8' : 'left-8'} text-white max-w-md`}>
                <h2 className="text-3xl mb-4">Join Our Community</h2>
                <p className="text-lg opacity-90">
                  Experience the finest collection of authentic Islamic products and join thousands of satisfied customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
