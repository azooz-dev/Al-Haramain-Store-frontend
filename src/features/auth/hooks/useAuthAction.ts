import {
  loginStart,
  loginSuccess,
  loginFailure
} from "@/store/slices/authSlice";
import {
  useLazyGetCsrfCookieQuery,
  useLoginMutation,
} from "../services/authApi";
import { LoginRequest, LoginResponseFailure } from "../types";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router-dom";

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const [triggerCsrf] = useLazyGetCsrfCookieQuery();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const isUnverifiedResponse = (payload: LoginResponseFailure): boolean | string => {
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
      if (isUnverifiedResponse(error as LoginResponseFailure)) {
        navigate("/verify-otp", { replace: true, state: { email: payload.email } });
        return true;
      }
      dispatch(loginFailure(error as LoginResponseFailure));
      return false;
    }
  }

  return {
    handleSignIn
  }
}