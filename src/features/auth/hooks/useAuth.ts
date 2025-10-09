import { useAppSelector } from "@/store/hooks";
import { useAuthActions } from "./useAuthActions";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectCurrentUser
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const currentUser = useAppSelector(selectCurrentUser);

  return {
    isAuthenticated,
    isLoading,
    error,
    currentUser,
    ...useAuthActions()
  }
}