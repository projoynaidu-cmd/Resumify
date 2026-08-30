import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/auth/ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile — Resumify' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="font-serif text-2xl font-bold text-[var(--text)]">Profile</h1>
        <p className="text-sm text-[var(--text3)] mt-1">
          Manage your account details
        </p>
      </div>
      <ProfileForm user={session.user} />
    </div>
  )
}

