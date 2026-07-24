import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { BillingPageClient } from '@/components/billing/BillingPageClient'

interface Props {
  searchParams: Promise<{ success?: string; canceled?: string }>
}

export default async function BillingPage({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const { success, canceled } = await searchParams

  // Load subscription details from DB
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      planExpiresAt: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  })

  return (
    <BillingPageClient
      plan={user?.plan ?? 'FREE'}
      planExpiresAt={user?.planExpiresAt?.toISOString() ?? null}
      hasStripeAccount={!!user?.stripeCustomerId}
      justUpgraded={success === '1'}
      justCanceled={canceled === '1'}
    />
  )
}
