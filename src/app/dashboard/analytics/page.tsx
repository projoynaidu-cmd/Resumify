import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserResumeAnalytics } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — ResumeForge' }

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const analytics = await getUserResumeAnalytics(session.user.id)

  return <AnalyticsDashboard data={analytics} />
}
