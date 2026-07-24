/**
 * Prompt templates for each AI feature.
 * Keeping these separate from the API routes makes them easy to
 * test, version, and tune independently of request handling.
 */

import type { ResumeState, ExperienceEntry } from '@/types'

// ─── Summary generator ────────────────────────────────────────

export const SUMMARY_SYSTEM_PROMPT = `You are an expert resume writer. Write a single professional summary paragraph (2-3 sentences, 40-60 words) for a resume. The tone is confident, specific, and achievement-oriented — never generic or filled with buzzwords like "results-driven" or "team player" used without evidence. Output ONLY the summary paragraph text, no preamble, no quotes, no markdown.`

export function buildSummaryPrompt(state: ResumeState): string {
  const p = state.personal
  const topSkills = state.skills.slice(0, 6).join(', ')
  const latestRole = state.experience[0]
  const yearsOfExp = state.experience.length

  const parts = [
    `Job title: ${p.title || 'Not specified'}`,
    topSkills && `Key skills: ${topSkills}`,
    latestRole && `Most recent role: ${latestRole.title} at ${latestRole.company}`,
    latestRole?.desc && `Role details: ${latestRole.desc}`,
    yearsOfExp > 0 && `Total roles listed: ${yearsOfExp}`,
    state.education[0] && `Education: ${state.education[0].degree}, ${state.education[0].school}`,
  ].filter(Boolean)

  return `Write a professional summary based on this candidate's background:\n\n${parts.join('\n')}`
}

// ─── Bullet point improver ────────────────────────────────────

export const BULLET_SYSTEM_PROMPT = `You are an expert resume writer specializing in achievement-oriented bullet points. Rewrite the given job description into 2-4 punchy bullet points that:
- Start with strong action verbs (Led, Built, Reduced, Increased, Architected, etc.)
- Include specific, quantifiable metrics wherever plausible (%, $, time saved, scale) — if no metric is given, phrase the achievement clearly without inventing fake numbers
- Are concise (under 20 words each)
- Avoid first-person pronouns
- Use industry-standard ATS-friendly language

Output ONLY the bullet points, one per line, each starting with "• ". No preamble, no markdown headers, no explanation.`

export function buildBulletPrompt(entry: ExperienceEntry): string {
  return `Job title: ${entry.title}\nCompany: ${entry.company}\n\nCurrent description:\n${entry.desc || '(none provided — infer reasonable achievements from the job title)'}\n\nRewrite this into punchy achievement bullet points.`
}

// ─── Cover letter ─────────────────────────────────────────────

export const COVER_LETTER_SYSTEM_PROMPT = `You are an expert career coach writing a cover letter on behalf of a job candidate. Write a complete, professional cover letter body (NOT including "Dear X," greeting or "Sincerely, Name" sign-off — those are added separately). The letter should:
- Be 3-4 paragraphs, 200-300 words total
- Open with genuine enthusiasm for the specific role and company
- Connect the candidate's actual experience to the role's likely needs
- Avoid generic filler phrases ("I am writing to express my interest")
- Sound human and specific, not templated
- Close with a confident call to action

Output ONLY the letter body paragraphs, no greeting, no sign-off, no markdown.`

export function buildCoverLetterPrompt(state: ResumeState): string {
  const p = state.personal
  const cl = state.coverLetter
  const topSkills = state.skills.slice(0, 5).join(', ')
  const latestRole = state.experience[0]

  const parts = [
    `Candidate name: ${[p.fname, p.lname].filter(Boolean).join(' ')}`,
    `Candidate current/target title: ${p.title || 'Not specified'}`,
    `Target position: ${cl.position || 'Not specified'}`,
    `Target company: ${cl.company || 'Not specified'}`,
    topSkills && `Key skills: ${topSkills}`,
    state.about && `Professional summary: ${state.about}`,
    latestRole && `Most recent role: ${latestRole.title} at ${latestRole.company} — ${latestRole.desc}`,
  ].filter(Boolean)

  return `Write a cover letter body using this candidate information:\n\n${parts.join('\n')}`
}

// ─── ATS keyword gap analysis ─────────────────────────────────

export const ATS_KEYWORDS_SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) optimization expert. Compare a job description against a candidate's resume content and identify important keywords/skills from the job description that are MISSING from the resume. Focus on hard skills, tools, certifications, and specific terminology — not generic soft skills.

Respond with ONLY a JSON array of strings, no markdown, no explanation, no code fences. Maximum 12 items, ordered by importance. Example format:
["Kubernetes", "GraphQL", "PMP Certification", "Agile/Scrum"]

If the resume already covers the job description well, return an empty array: []`

export function buildAtsKeywordsPrompt(state: ResumeState, jobDescription: string): string {
  const resumeSkills = state.skills.join(', ')
  const resumeExperience = state.experience
    .map((e) => `${e.title} at ${e.company}: ${e.desc}`)
    .join('\n')

  return `Job description:\n${jobDescription}\n\n---\n\nCandidate's current resume skills: ${resumeSkills}\n\nCandidate's experience:\n${resumeExperience}\n\nWhich important keywords from the job description are missing from this resume?`
}
