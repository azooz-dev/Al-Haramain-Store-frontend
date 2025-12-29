/**
 * Environment Variable Validation
 * Ensures all required environment variables are present in production
 */

const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_SESSION_DOMAIN',
] as const;

const optionalEnvVars = [
  'VITE_STRIPE_PUBLISHABLE_KEY',
] as const;

export function validateEnv(): void {
  const missing = requiredEnvVars.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0 && import.meta.env.PROD) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Warn about missing optional variables in development
  if (import.meta.env.DEV) {
    const missingOptional = optionalEnvVars.filter(
      (key) => !import.meta.env[key]
    );

    if (missingOptional.length > 0) {
      console.warn(
        `Optional environment variables not set: ${missingOptional.join(', ')}`
      );
    }
  }
}

/**
 * Get environment variable with type safety
 */
export function getEnv(key: string, fallback?: string): string {
  const value = import.meta.env[key];
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || fallback || '';
}
