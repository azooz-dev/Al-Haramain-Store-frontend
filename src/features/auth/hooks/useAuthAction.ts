import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutFailure,
  logout as logoutAction
} from "@/store/slices/authSlice";
import {
  useLazyGetCsrfCookieQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from "../services/authApi";
import { LoginRequest, RegisterRequest, RequestFailure, RegisterSuccess } from "../types";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { removeAllCookies } from "@/shared/utils/cookies";

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const [triggerCsrf] = useLazyGetCsrfCookieQuery();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const isUnverifiedResponse = (payload: RequestFailure): boolean | string => {
    if (!payload) return false;

    const message = payload.message;
    const status = payload.status;

    if (!message || status !== "error") return false;

    return message;
  }

  const handleSignIn = async (payload: LoginRequest): Promise<boolean> => {
    try {
      // Dispatch csrf cookie
      dispatch(loginStart());
      await triggerCsrf().unwrap();

      const response = await login({ email: payload.email, password: payload.password }).unwrap();

      if (response.data.user) {
        // Store the token in localStorage for persistence
        if (response.data.token) localStorage.setItem("auth_token", response.data.token);
        dispatch(loginSuccess({ data: response.data, message: response.message, status: response.status }));
      }

      navigate("/", { replace: true });
      return true;
    } catch (error: unknown) {
      if (isUnverifiedResponse(error as RequestFailure)) {
        navigate("/verify-otp", { replace: true, state: { email: payload.email } });
        return true;
      }
      dispatch(loginFailure(error as RequestFailure));
      return false;
    }
  }

  const handleSignUp = async (payload: RegisterRequest): Promise<RegisterSuccess> => {
    try {
      dispatch(registerStart());

      await triggerCsrf().unwrap();

      const response = await register(payload).unwrap();
      if (response.data) {
        // Store user data but don't authenticate yet - they need OTP verification
        dispatch(registerSuccess({ data: response.data, message: response.message, status: response.status }));
        // Redirect to OTP verification page
        navigate("/verify-otp", { replace: true, state: { email: response.data.email } });
        return { success: true, requiresOTP: true, email: response.data.email };
      }
      return { success: false, requiresOTP: false };
    } catch (error: unknown) {
      dispatch(registerFailure(error as RequestFailure));
      return { success: false };
    }
  }

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      dispatch(logoutFailure(error as RequestFailure));
    } finally {
      removeAllCookies();
      localStorage.removeItem("auth_token");
      dispatch(logoutAction());
    }
  }

  return {
    handleSignIn,
    handleSignUp,
    handleSignOut
  }
}