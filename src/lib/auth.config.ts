/**
 * Edge-safe NextAuth config — NO Prisma, NO bcrypt.
 * Used by middleware.ts which runs in the Edge runtime.
 */
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  providers: [],  // Providers added in auth.ts (Node.js only)
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = request.nextUrl

      const PROTECTED = ['/dashboard', '/builder', '/profile', '/settings', '/billing']
      const AUTH_ONLY = ['/auth/login', '/auth/register']

      if (isLoggedIn && AUTH_ONLY.some((r) => pathname.startsWith(r))) {
        return Response.redirect(new URL('/dashboard', request.nextUrl))
      }
      if (!isLoggedIn && PROTECTED.some((p) => pathname.startsWith(p))) {
        const url = new URL('/auth/login', request.nextUrl)
        url.searchParams.set('callbackUrl', pathname)
        return Response.redirect(url)
      }
      return true
    },
  },
}
