import React, { createContext, useContext, useEffect, ReactNode } from "react";
import {
  selectTheme,
  selectLanguage,
  selectIsRTL,
  toggleTheme as toggleThemeAction,
  toggleLanguage as toggleLanguageAction,
  setIsRTL as setIsRTLAction
} from "@store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface AppContextType {
  theme: "light" | "dark";
  language: "en" | "ar";
  isRTL: boolean;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setIsRTL: (isRTL: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const language = useAppSelector(selectLanguage);
  const isRTL = useAppSelector(selectIsRTL);

  const toggleTheme = () => dispatch(toggleThemeAction());
  const toggleLanguage = () => dispatch(toggleLanguageAction());
  const setIsRTL = (value: boolean) => dispatch(setIsRTLAction(value));

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <AppContext.Provider value={{ theme, language, isRTL, toggleLanguage, toggleTheme, setIsRTL }}>
      { children }
    </AppContext.Provider>
  )
}