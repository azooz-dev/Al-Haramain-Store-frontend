export const APP_CONFIG = {
  name: 'Al-Haramain Store',
  version: '1.0.0',
  defaultLanguage: "en",
  supportedLanguages: ["en", "ar"],
  itemsPerPage: 6,
  maxCartItems: 100,
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  sessionDomain: process.env.VITE_SESSION_DOMAIN || '127.0.0.1',
} as const;