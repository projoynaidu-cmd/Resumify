import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/Providers'

export const metadata: Metadata = {
  title: 'ResumeForge — Professional Resume Builder',
  description:
    'Build professional, ATS-optimized resumes with multiple templates, live preview, and one-click PDF export.',
  keywords: ['resume builder', 'CV maker', 'ATS resume', 'professional resume'],
  openGraph: {
    title: 'ResumeForge',
    description: 'Build beautiful, ATS-optimized resumes in minutes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600&family=Lora:wght@400;600;700&family=Nunito:wght@300;400;600;700&family=Raleway:wght@300;400;500;600&family=Source+Serif+4:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
