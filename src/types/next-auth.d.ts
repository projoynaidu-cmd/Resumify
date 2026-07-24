import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: string
      planExpiresAt?: Date | null
    } & DefaultSession['user']
  }

  interface User {
    id?: string
    plan?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
    planExpiresAt?: Date | null
  }
}
