// ============================================================
// RESUME DATA TYPES
// ============================================================

export interface PersonalInfo {
  fname: string
  lname: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  github: string
  twitter: string
}

export interface ExperienceEntry {
  id: string
  title: string
  company: string
  date: string
  desc: string
}

export interface EducationEntry {
  id: string
  degree: string
  school: string
  date: string
  desc: string
}

export interface ProjectEntry {
  id: string
  name: string
  tech: string
  date: string
  desc: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface CoverLetter {
  to: string
  company: string
  position: string
  date: string
  body: string
}

// ============================================================
// TEMPLATE & THEME TYPES
// ============================================================

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'compact'
  | 'timeline'
  | 'elegant'
  | 'technical'
  | 'bold'

export interface TemplateOption {
  id: TemplateId
  label: string
  description: string
}

export interface FontOption {
  label: string
  value: string
  name: string
  sample: string
}

export interface FontPairing {
  id: string
  label: string
  heading: string   // CSS font-family value, e.g. "'Playfair Display', serif"
  headingName: string
  body: string
  bodyName: string
  description: string
}

export interface AccentColor {
  label: string
  value: string
}

/**
 * A saved custom color palette — beyond the single accent color,
 * lets users control header, text, and background tones independently.
 */
export interface CustomPalette {
  id: string
  name: string
  accent: string
  header: string
  text: string
  subtle: string
  border: string
  background: string
  createdAt: string  // ISO date
}

// ============================================================
// APP STATE TYPES
// ============================================================

export interface ResumeState {
  // Meta
  template: TemplateId
  accentColor: string
  resumeFont: string
  headingFont: string | null   // null = use resumeFont for headings too
  fontPairingId: string | null // if set, overrides resumeFont/headingFont with a preset pairing
  filename: string
  photoDataUrl: string | null

  // Custom palette (overrides accentColor-only theming when set)
  customPalette: CustomPalette | null

  // Content
  personal: PersonalInfo
  about: string
  skills: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  customSections: CustomSection[]
  coverLetter: CoverLetter

  // Section ordering (array of section keys)
  sectionOrder: SectionKey[]
}

export type SectionKey =
  | 'personal'
  | 'appearance'
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'custom'

export interface SectionMeta {
  key: SectionKey
  label: string
  icon: string
  draggable: boolean
}

// ============================================================
// UI STATE TYPES
// ============================================================

export type ActiveView = 'resume' | 'coverletter'

export interface UIState {
  activeView: ActiveView
  theme: 'light' | 'dark'
  openSections: Set<SectionKey>
  isExporting: boolean
  exportProgress: number
  exportLabel: string
}

// ============================================================
// HISTORY TYPES
// ============================================================

export interface HistoryState {
  stack: string[]
  index: number
  maxSize: number
}

// ============================================================
// ATS TYPES
// ============================================================

export interface AtsCheck {
  label: string
  pass: boolean
  weight: number
}

export interface AtsResult {
  score: number
  checks: AtsCheck[]
  level: 'low' | 'mid' | 'high'
}

// ============================================================
// TOAST TYPES
// ============================================================

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

// ============================================================
// FORM VALIDATION SCHEMAS (Zod types exported for use)
// ============================================================

export interface PersonalFormValues extends PersonalInfo {}

export interface ExperienceFormValues {
  title: string
  company: string
  date: string
  desc: string
}

export interface EducationFormValues {
  degree: string
  school: string
  date: string
  desc: string
}

export interface ProjectFormValues {
  name: string
  tech: string
  date: string
  desc: string
}

export interface CoverLetterFormValues extends CoverLetter {}
