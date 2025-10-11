import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutFailure,
  logout as logoutAction,
  otpSuccess,
  otpFailure,
  setAuthLoading,
  clearError
} from "@/store/slices/authSlice";
import {
  useLazyGetCsrfCookieQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} from "../services/authApi";
import {
  LoginRequest,
  RegisterRequest,
  RequestFailure,
  RegisterSuccess,
  VerifyEmailRequest,
  ResendCodeRequest,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ProcessedError,
} from "../types";
import { useAppDispatch } from "@/store/hooks";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { useNavigation } from "@/shared/hooks/useNavigation";

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const [triggerCsrf] = useLazyGetCsrfCookieQuery();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [logout] = useLogoutMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendCode] = useResendCodeMutation();
  const [forgetPassword] = useForgetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();
  const { navigateToVerifyOTP, navigateToHome } = useNavigation();
  const isUnverifiedResponse = (payload: RequestFailure): boolean | string => {
    if (!payload) return false;

    const error = extractErrorMessage(payload);
    const message = error.data.message;
    const status = error.data.status;

    if (!message || status !== "error") return false;

    return message;
  }

  const handleSignIn = async (payload: LoginRequest): Promise<boolean> => {
    try {
      // Dispatch csrf cookie
      dispatch(clearError());
      dispatch(loginStart());
      await triggerCsrf().unwrap();

      const response = await login({ email: payload.email, password: payload.password }).unwrap();

      if (response.data.user) {
        // Store the token in localStorage for persistence
        if (response.data.token) localStorage.setItem("auth_token", response.data.token);
        dispatch(loginSuccess({ data: response.data, message: response.message, status: response.status }));
      }

      navigateToHome();
      return true;
    } catch (error: unknown) {
      if ((error as RequestFailure).status === 403) {
        if (isUnverifiedResponse(error as RequestFailure)) {
          navigateToVerifyOTP(payload.email);
          return true;
        }
      }
      const errorData = extractErrorMessage(error as RequestFailure);
      dispatch(loginFailure(errorData as ProcessedError));
      return false;
    }
  }

  const handleSignUp = async (payload: RegisterRequest): Promise<RegisterSuccess> => {
    try {
      dispatch(clearError());
      dispatch(registerStart());

      await triggerCsrf().unwrap();

      const response = await register(payload).unwrap();
      if (response.data) {
        // Store user data but don't authenticate yet - they need OTP verification
        dispatch(registerSuccess({ data: response.data, message: response.message, status: response.status }));
        // Redirect to OTP verification page
        navigateToVerifyOTP(response.data.email);
        return { success: true, requiresOTP: true, email: response.data.email };
      }
      return { success: false, requiresOTP: false };
    } catch (error: unknown) {
      dispatch(registerFailure(error as ProcessedError));
      return { success: false };
    }
  }

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      dispatch(logoutFailure(error as ProcessedError));
    } finally {
      localStorage.removeItem("auth_token");
      dispatch(logoutAction());
    }
  }

  const handleVerifyEmail = async (payload: VerifyEmailRequest): Promise<boolean> => {
    try {
      const response = await verifyEmail(payload).unwrap();

      if (response.data.user && response.data.token) {
        // Store the token in localStorage for persistence
        localStorage.setItem("auth_token", response.data.token);
        dispatch(otpSuccess(response));

        navigateToHome();
        return true;
      }
      return false;
    } catch (error: unknown) {
      dispatch(otpFailure(error as ProcessedError));
      return false;
    }
  }

  const handleResendOTP = async (payload: ResendCodeRequest): Promise<boolean> => {
    try {
      const response = await resendCode(payload).unwrap();
      return response.status === 'success';
    } catch {
      return false;
    }
  }

  const handleForgetPassword = async (payload: ForgetPasswordRequest): Promise<ForgetPasswordResponse> => {
    try {
      dispatch(clearError());
      dispatch(setAuthLoading(true));

      const response = await forgetPassword(payload).unwrap();

      dispatch(setAuthLoading(false));

      return response.status === "success" ? response : { message: "Failed to forget password", status: "error" };
    } catch (error: unknown) {
      const errorData = extractErrorMessage(error as RequestFailure);
      return { 
        message: errorData.data.message, 
        status: "error" 
      };
    }
  }

  const handleResetPassword = async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    try {
      dispatch(clearError());
      dispatch(setAuthLoading(true));
      const response = await resetPassword(payload).unwrap();

      dispatch(setAuthLoading(false));

      return response.status === "success" ? response : { message: "Failed to reset password", status: "error" };
    } catch (error: unknown) {
      const errorData = extractErrorMessage(error as RequestFailure);
      return { 
        message: errorData.data.message, 
        status: "error" 
      };
    }
  }

  const handleClearError = () => {
    dispatch(clearError());
  }

  const handleSetAuthLoading = (loading: boolean) => {
    dispatch(setAuthLoading(loading));
  }

  return {
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleVerifyEmail,
    handleResendOTP,
    handleForgetPassword,
    handleResetPassword,
    handleClearError,
    handleSetAuthLoading
  }
}