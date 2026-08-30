/**
 * Full NextAuth config — Node.js runtime only.
 * Import this in: API routes, Server Components, server actions.
 * NEVER import this in middleware.ts (Edge runtime).
 */
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'
import { loginSchema } from '@/lib/schemas'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // NOTE: Rate limiting for credential sign-in should be applied here.
        // The in-memory authRateLimiter from '@/lib/rate-limit' cannot be used
        // directly in this Edge-safe module, so rate-limit credential login
        // at the API layer (e.g. via a custom /api/auth/credentials route)
        // or deploy with a Redis-backed rate limiter for multi-instance support.
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const { email, password } = parsed.data
        const user = await db.user.findUnique({ where: { email } })
        if (!user?.password) return null
        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null
        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        const dbUser = await db.user.findUnique({
          where: { id: user.id as string },
          select: { plan: true },
        })
        token.plan = dbUser?.plan ?? 'FREE'
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.plan = token.plan as string
      }
      return session
    },
  },
})
