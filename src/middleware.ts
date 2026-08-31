/**
 * Next.js middleware — Edge runtime.
 * Edge-safe: no Prisma, no bcrypt, no Node.js-only modules.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED = ['/dashboard', '/builder', '/profile', '/settings', '/billing']
const AUTH_ONLY = ['/auth/login', '/auth/register']

export async function middleware(req: NextRequest) {
  // In production (HTTPS/Vercel), Auth.js uses __Secure- prefixed cookies.
  // Without secureCookie: true, getToken looks for the non-secure cookie name
  // and fails to find the session, causing a redirect loop after OAuth login.
  const secureCookie = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https'

  const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie })
  const isLoggedIn = !!token
  const { pathname } = req.nextUrl

  if (isLoggedIn && AUTH_ONLY.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isLoggedIn && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = new URL('/auth/login', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
