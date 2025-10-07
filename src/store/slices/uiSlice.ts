import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIstate {
  theme: "light" | 'dark',
  language: "en" | "ar",
  isRTL: boolean,
  isLoading: boolean,
  error: string | null
};

const initialState: UIstate = {
  theme: "light",
  language: "en",
  isRTL: false,
  isLoading: false,
  error: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'ar' : 'en';
      state.isRTL = state.language === 'ar';
    },
    setIsRTL: (state, action: PayloadAction<boolean>) => {
      state.isRTL = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { toggleTheme, toggleLanguage, setIsLoading, setIsRTL, setError } = uiSlice.actions;

export const selectTheme = (state: { ui: UIstate }) => state.ui.theme;
export const selectLanguage = (state: { ui: UIstate }) => state.ui.language;
export const selectIsRTL = (state: { ui: UIstate }) => state.ui.isRTL;
export const selectIsLoading = (state: { ui: UIstate }) => state.ui.isLoading;
export const selectError = (state: { ui: UIstate }) => state.ui.error;

export default uiSlice.reducer;