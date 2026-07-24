/**
 * Prisma client singleton.
 *
 * IMPORTANT: Run `npx prisma generate` after cloning.
 * All imports of this file must be in server-only code (API routes,
 * Server Components, server actions) — never in client components.
 *
 * We use a lazy getter so Turbopack doesn't evaluate the require()
 * call at bundle-analysis time.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as Record<string, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(): any {
  if (g.__prismaDb) return g.__prismaDb

  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client')
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') g.__prismaDb = client
  return client
}

/**
 * Use `db` as a direct reference — it calls getDb() lazily on first property access.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: any = new Proxy({} as any, {
  get(_target, prop) {
    return getDb()[prop]
  },
})
