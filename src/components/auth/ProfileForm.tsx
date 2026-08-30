'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import { z } from 'zod'
import { Loader2, CheckCircle2, Sparkles, LogOut } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Divider } from '@/components/ui/Divider'
import Link from 'next/link'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})
type ProfileValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    plan?: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState('')
  const isPro = user.plan === 'PRO' || user.plan === 'ENTERPRISE'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name ?? '' },
  })

  async function onSubmit(values: ProfileValues) {
    setServerError('')
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = await res.json()
      setServerError(data.error ?? 'Failed to save')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + plan */}
      <div className="flex items-center gap-4 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]">
        <div className="w-14 h-14 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] grid place-items-center flex-shrink-0 overflow-hidden text-xl font-bold">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'User avatar'}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            user.name?.charAt(0).toUpperCase() ?? 'U'
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--text)] truncate">{user.name}</p>
          <p className="text-sm text-[var(--text3)] truncate">{user.email}</p>
          <div className="mt-1.5">
            <Badge variant={isPro ? 'success' : 'default'}>
              {isPro ? '⭐ Pro' : 'Free plan'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Update name */}
      <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]">
        <h2 className="font-semibold text-[var(--text)] mb-4">Personal information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="bg-[#feeeed] border border-[#fdddd9] text-[var(--danger)] text-sm rounded-[var(--radius-sm)] px-3.5 py-2.5">
              {serverError}
            </div>
          )}
          <Input
            label="Display Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            value={user.email ?? ''}
            disabled
            className="opacity-60 cursor-not-allowed"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#27ae60]">
                <CheckCircle2 size={15} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Upgrade */}
      {!isPro && (
        <div className="p-5 bg-gradient-to-r from-[var(--accent)] to-[#4a8c5e] rounded-[var(--radius)] text-white flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold flex items-center gap-2">
              <Sparkles size={16} /> Upgrade to Pro
            </p>
            <p className="text-[0.82rem] opacity-85 mt-0.5">
              Unlimited resumes, AI features, all templates.
            </p>
          </div>
          <Link
            href="/billing"
            className="flex-shrink-0 bg-white text-[var(--accent)] px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold hover:opacity-90 transition-opacity no-underline"
          >
            Upgrade →
          </Link>
        </div>
      )}

      <Divider />

      {/* Danger zone */}
      <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]">
        <h2 className="font-semibold text-[var(--text)] mb-1">Account</h2>
        <p className="text-sm text-[var(--text3)] mb-4">Sign out of your account on this device.</p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut size={13} /> Sign out
        </Button>
      </div>
    </div>
  )
}
