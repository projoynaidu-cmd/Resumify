import { notFound } from 'next/navigation'
import { getResumeBySlug } from '@/lib/resume-sync'
import { PublicResumeViewer } from '@/components/builder/PublicResumeViewer'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resume = await getResumeBySlug(slug)
  if (!resume) return { title: 'Resume not found — ResumeForge' }

  const name = [resume.data?.personal?.fname, resume.data?.personal?.lname]
    .filter(Boolean)
    .join(' ')

  return {
    title: `${name || resume.title} — ResumeForge`,
    description: resume.data?.about?.slice(0, 160) ?? `View ${name}'s resume on ResumeForge`,
    openGraph: {
      title: `${name}'s Resume`,
      description: resume.data?.about?.slice(0, 160) ?? '',
      type: 'profile',
    },
  }
}

export default async function PublicResumePage({ params }: Props) {
  const { slug } = await params
  const resume = await getResumeBySlug(slug)
  if (!resume) notFound()

  const name = [resume.data?.personal?.fname, resume.data?.personal?.lname]
    .filter(Boolean)
    .join(' ')

  return (
    <PublicResumeViewer
      resumeId={resume.id}
      resumeData={resume.data}
      ownerName={name || resume.title}
      slug={slug}
      viewCount={resume.viewCount ?? 0}
    />
  )
}
