import { useAppSelector } from "@/store/hooks";
import { useAuthActions } from "./useAuthActions";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectCurrentUser,
  setAuthLoading,
} from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

export const useAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(false));
  }, [dispatch]);

  return {
    isAuthenticated,
    isLoading,
    error,
    currentUser,
    ...useAuthActions()
  }
}