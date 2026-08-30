/**
 * Prisma client singleton.
 *
 * IMPORTANT: Run `npx prisma generate` after cloning.
 * All imports of this file must be in server-only code (API routes,
 * Server Components, server actions) — never in client components.
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  __prismaDb?: PrismaClient
}

function getDb(): PrismaClient {
  if (globalForPrisma.__prismaDb) return globalForPrisma.__prismaDb

  const adapter = new PrismaPg(process.env.DATABASE_URL ?? '')

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__prismaDb = client
  }

  return client
}

export { getDb }

export const db = getDb()
