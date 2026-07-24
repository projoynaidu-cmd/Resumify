'use client'

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { useUIStore } from '@/store'
import { ToastContainer } from '@/components/shared/Toast'
import { PosthogProvider } from './PosthogProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <SessionProvider>
      <PosthogProvider>
        {children}
        <ToastContainer />
      </PosthogProvider>
    </SessionProvider>
  )
}
