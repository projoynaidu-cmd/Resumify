import { User } from 'lucide-react'
import type { CustomSection } from '@/types'

// ─── Avatar ──────────────────────────────────────────────────
interface AvatarProps {
  photoDataUrl: string | null
  className?: string
}

export function Avatar({ photoDataUrl, className }: AvatarProps) {
  return (
    <div className={className}>
      {photoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoDataUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
      ) : (
        <User size={28} />
      )}
    </div>
  )
}

// ─── Entry Description ────────────────────────────────────────
export function EntryDesc({ desc }: { desc?: string }) {
  if (!desc) return null
  return (
    <div className="r-entry-desc" style={{ whiteSpace: 'pre-line' }}>
      {desc}
    </div>
  )
}

// ─── Tags Row ─────────────────────────────────────────────────
export function TagsRow({ tech, cls = 'r-tag', wrapCls = 'r-tags' }: { tech?: string; cls?: string; wrapCls?: string }) {
  if (!tech) return null
  const tags = tech.split(',').map((t) => t.trim()).filter(Boolean)
  if (!tags.length) return null
  return (
    <div className={wrapCls}>
      {tags.map((tag) => (
        <span key={tag} className={cls}>{tag}</span>
      ))}
    </div>
  )
}

// ─── Custom Sections Renderer ─────────────────────────────────
interface CustomSectionsProps {
  sections: CustomSection[]
  titleCls: string
  sectionCls: string
  itemCls?: string
}

export function CustomSectionsRenderer({
  sections,
  titleCls,
  sectionCls,
  itemCls,
}: CustomSectionsProps) {
  if (!sections.length) return null
  return (
    <>
      {sections.map((sec) => {
        const lines = sec.content.split('\n').map((l) => l.trim()).filter(Boolean)
        return (
          <div key={sec.id} className={sectionCls}>
            <div className={titleCls}>{sec.title}</div>
            {lines.map((line, i) => (
              <div key={i} className={itemCls ?? 'r-entry-desc'} style={{ marginBottom: '4px' }}>
                {line}
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}
