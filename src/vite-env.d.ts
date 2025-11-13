/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_SESSION_DOMAIN?: string;
	readonly STRIPE_PUBLISH_KEY;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
