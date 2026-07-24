/**
 * Plain-text resume export.
 *
 * Produces a clean, ATS-friendly plain-text version of the resume
 * suitable for pasting into job application forms or copying to clipboard.
 */

import type { ResumeState } from '@/types'

const LINE = '─'.repeat(52)
const SECTION_LINE = '━'.repeat(52)

function line(label?: string): string {
  if (label) return `\n${SECTION_LINE}\n${label.toUpperCase()}\n${SECTION_LINE}`
  return LINE
}

function compact(...parts: (string | undefined | null | false)[]): string {
  return parts.filter(Boolean).join(' · ')
}

/**
 * Converts a `ResumeState` into a formatted plain-text string.
 */
export function resumeToPlainText(state: ResumeState): string {
  const p = state.personal
  const sections: string[] = []

  // ── Header ────────────────────────────────────────────────
  const name = [p.fname, p.lname].filter(Boolean).join(' ')
  const contact = compact(p.email, p.phone, p.location, p.website, p.github, p.twitter)

  sections.push(`${name}${p.title ? `\n${p.title}` : ''}`)
  if (contact) sections.push(contact)

  // ── Summary ───────────────────────────────────────────────
  if (state.about) {
    sections.push(`${line('Summary')}\n${state.about}`)
  }

  // ── Skills ────────────────────────────────────────────────
  if (state.skills.length > 0) {
    sections.push(`${line('Skills')}\n${state.skills.join(' · ')}`)
  }

  // ── Experience ────────────────────────────────────────────
  if (state.experience.length > 0) {
    const entries = state.experience
      .map((exp) => {
        const header = compact(exp.title, exp.company)
        return [
          header,
          exp.date ? `  ${exp.date}` : '',
          exp.desc
            ? exp.desc
                .split('\n')
                .map((l) => `  ${l}`)
                .join('\n')
            : '',
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join(`\n${line()}\n`)

    sections.push(`${line('Experience')}\n${entries}`)
  }

  // ── Education ─────────────────────────────────────────────
  if (state.education.length > 0) {
    const entries = state.education
      .map((edu) => {
        const header = compact(edu.degree, edu.school)
        return [header, edu.date ? `  ${edu.date}` : '', edu.desc ? `  ${edu.desc}` : '']
          .filter(Boolean)
          .join('\n')
      })
      .join(`\n${line()}\n`)

    sections.push(`${line('Education')}\n${entries}`)
  }

  // ── Projects ──────────────────────────────────────────────
  if (state.projects.length > 0) {
    const entries = state.projects
      .map((proj) => {
        const header = compact(proj.name, proj.date)
        return [
          header,
          proj.tech ? `  Stack: ${proj.tech}` : '',
          proj.desc
            ? proj.desc
                .split('\n')
                .map((l) => `  ${l}`)
                .join('\n')
            : '',
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join(`\n${line()}\n`)

    sections.push(`${line('Projects')}\n${entries}`)
  }

  // ── Custom sections ───────────────────────────────────────
  for (const sec of state.customSections) {
    const lines = sec.content
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join('\n')
    if (lines) {
      sections.push(`${line(sec.title)}\n${lines}`)
    }
  }

  return sections.join('\n\n') + '\n'
}

/**
 * Writes the plain-text resume to the clipboard.
 * Returns `true` on success, `false` if the Clipboard API is unavailable.
 */
export async function copyResumeToClipboard(state: ResumeState): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false
  try {
    await navigator.clipboard.writeText(resumeToPlainText(state))
    return true
  } catch {
    return false
  }
}

/**
 * Triggers a browser download of the plain-text resume as a `.txt` file.
 */
export function downloadResumeAsText(state: ResumeState): void {
  const text = resumeToPlainText(state)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.filename || 'resume'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
