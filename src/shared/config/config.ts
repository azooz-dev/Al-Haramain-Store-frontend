export const APP_CONFIG = {
	name: "Al-Haramain Store",
	version: "1.0.0",
	defaultLanguage: "en",
	supportedLanguages: ["en", "ar"],
	itemsPerPage: 6,
	maxCartItems: 100,
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost",
	sessionDomain: import.meta.env.VITE_SESSION_DOMAIN || "localhost",
	stripePublishKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
} as const;
