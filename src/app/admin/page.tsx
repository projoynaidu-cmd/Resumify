import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAdminStats, getUserGrowthData } from '@/lib/analytics'
import { AdminDashboard } from '@/components/analytics/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Resumify' }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean)

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.email) redirect('/auth/login')

  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(session.user.email)) {
    redirect('/dashboard')
  }

  const [stats, growth] = await Promise.all([
    getAdminStats(),
    getUserGrowthData(30),
  ])

  return <AdminDashboard stats={stats} growth={growth} />
}

