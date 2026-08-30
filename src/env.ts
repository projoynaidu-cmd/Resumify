/**
 * Typed environment configuration.
 *
 * All `NEXT_PUBLIC_*` variables are safe to use on the client.
 * Server-only variables must never be imported from client components.
 *
 * Add new variables here and access them via `env.*` throughout the app
 * instead of calling `process.env` directly — this gives you type safety
 * and a single place to document what each variable does.
 */

function requirePublic(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (value === undefined) {
    // In production builds this will throw at startup — intentional.
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function optionalPublic(key: string, fallback = ''): string {
  return process.env[key] ?? fallback
}

// ── Public (client-safe) ──────────────────────────────────────

export const env = {
  /** Application name shown in titles / meta */
  appName: optionalPublic('NEXT_PUBLIC_APP_NAME', 'Resumify'),

  /** Base URL of the deployed app (used for Open Graph, canonical links) */
  appUrl: optionalPublic('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),

  /** Current environment */
  nodeEnv: optionalPublic('NODE_ENV', 'development') as 'development' | 'test' | 'production',

  /** Whether we are running in production */
  get isProduction() {
    return this.nodeEnv === 'production'
  },

  /** Whether we are running in development */
  get isDevelopment() {
    return this.nodeEnv === 'development'
  },
} as const

// Re-export individual values for convenience
export const { appName, appUrl, isProduction, isDevelopment } = env

