/**
 * Cover letter template generation.
 *
 * Generates a professional placeholder body using the resume data
 * already entered by the user. The user can then edit it freely.
 */

import type { ResumeState } from '@/types'

export function generateCoverLetterBody(state: ResumeState): string {
  const p = state.personal
  const cl = state.coverLetter

  const position = cl.position || '[Position]'
  const company = cl.company || '[Company]'
  const recipient = cl.to || 'Hiring Manager'

  const topSkills =
    state.skills.length > 0
      ? state.skills.slice(0, 4).join(', ')
      : 'my areas of expertise'

  const yearsExp =
    state.experience.length > 1
      ? `${state.experience.length}+ years`
      : state.experience.length === 1
      ? 'hands-on experience'
      : 'experience'

  const mostRecentRole = state.experience[0]
  const recentRoleSentence = mostRecentRole
    ? `In my most recent role as ${mostRecentRole.title} at ${mostRecentRole.company}, ${mostRecentRole.desc}`
    : ''

  const summaryParagraph =
    state.about.length > 20
      ? state.about
      : `Throughout my career I have consistently delivered results that align with business objectives while maintaining a high standard of technical excellence.`

  const name = [p.fname, p.lname].filter(Boolean).join(' ') || 'the applicant'

  return `Dear ${recipient},

I am writing to express my strong interest in the ${position} position at ${company}. With ${yearsExp} of experience in ${topSkills}, I am confident I can make a meaningful contribution to your team from day one.

${summaryParagraph}

${recentRoleSentence}

I am particularly drawn to ${company} because of its reputation for innovation and commitment to excellence. The ${position} role aligns perfectly with both my technical background and my long-term career goals.

I would welcome the opportunity to discuss how my experience and skills can contribute to ${company}'s continued success. Thank you for your time and consideration.

Warm regards,
${name}`
}

/** Returns the formatted date string used as the default cover letter date */
export function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
