import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ResumeGrid } from '@/components/dashboard/ResumeGrid'
import { PlanBanner } from '@/components/dashboard/PlanBanner'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const resumes = await db.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const isPro = session.user.plan === 'PRO' || session.user.plan === 'ENTERPRISE'

  return (
    <div className="max-w-5xl mx-auto">
      {/* Plan banner for free users */}
      {!isPro && <PlanBanner resumeCount={resumes.length} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text)]">My Resumes</h1>
          <p className="text-sm text-[var(--text3)] mt-0.5">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
            {!isPro && ' · Free plan (3 max)'}
          </p>
        </div>
      </div>

      {/* Resume grid */}
      <ResumeGrid resumes={resumes} isPro={isPro} />
    </div>
  )
}
