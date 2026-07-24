import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DEFAULT_RESUME_STATE } from '@/lib/constants'
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage'
import { generateId } from '@/utils'
import type {
  ResumeState,
  PersonalInfo,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CustomSection,
  CoverLetter,
  TemplateId,
  SectionKey,
  CustomPalette,
} from '@/types'

// ============================================================
// HISTORY HELPERS
// ============================================================
const MAX_HISTORY = 50

interface HistorySlice {
  stack: string[]
  historyIndex: number
}

// ============================================================
// STORE INTERFACE
// ============================================================
interface ResumeStore extends ResumeState {
  // -- History --
  _history: HistorySlice
  snapshot: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  historyLabel: () => string

  // -- Personal --
  updatePersonal: (data: Partial<PersonalInfo>) => void

  // -- About --
  updateAbout: (text: string) => void

  // -- Skills --
  addSkill: (skill: string) => void
  removeSkill: (index: number) => void
  setSkills: (skills: string[]) => void

  // -- Experience --
  addExperience: () => void
  updateExperience: (id: string, data: Partial<Omit<ExperienceEntry, 'id'>>) => void
  removeExperience: (id: string) => void
  reorderExperience: (ids: string[]) => void

  // -- Education --
  addEducation: () => void
  updateEducation: (id: string, data: Partial<Omit<EducationEntry, 'id'>>) => void
  removeEducation: (id: string) => void

  // -- Projects --
  addProject: () => void
  updateProject: (id: string, data: Partial<Omit<ProjectEntry, 'id'>>) => void
  removeProject: (id: string) => void

  // -- Custom Sections --
  addCustomSection: () => void
  updateCustomSection: (id: string, data: Partial<Omit<CustomSection, 'id'>>) => void
  removeCustomSection: (id: string) => void

  // -- Cover Letter --
  updateCoverLetter: (data: Partial<CoverLetter>) => void

  // -- Appearance --
  setTemplate: (template: TemplateId) => void
  setAccentColor: (color: string) => void
  setResumeFont: (font: string) => void
  setHeadingFont: (font: string | null) => void
  setFontPairing: (pairingId: string | null) => void
  setCustomPalette: (palette: CustomPalette | null) => void
  setPhotoDataUrl: (url: string | null) => void

  // -- File --
  setFilename: (name: string) => void

  // -- Section order --
  reorderSections: (order: SectionKey[]) => void

  // -- Persistence --
  loadFromStorage: () => void
  saveToStorage: () => void
}

// ============================================================
// LOAD FROM STORAGE (called outside store)
// ============================================================
function loadInitialState(): ResumeState {
  if (typeof window === 'undefined') return DEFAULT_RESUME_STATE
  const saved = storageGet<Partial<ResumeState>>(STORAGE_KEYS.RESUME)
  if (saved) return { ...DEFAULT_RESUME_STATE, ...saved }
  return DEFAULT_RESUME_STATE
}

// ============================================================
// STORE
// ============================================================
export const useResumeStore = create<ResumeStore>()(
  immer((set, get) => {
    const initialState = loadInitialState()
    const initialSnap = JSON.stringify(initialState)

    return {
      // -- Spread initial resume state --
      ...initialState,

      // -- History initial --
      _history: {
        stack: [initialSnap],
        historyIndex: 0,
      },

      // --------------------------------------------------------
      // HISTORY
      // --------------------------------------------------------
      snapshot() {
        const current = get()
        const snap = JSON.stringify(extractResumeState(current))
        const history = current._history
        if (history.stack[history.historyIndex] === snap) return

        set((state) => {
          state._history.stack = state._history.stack.slice(0, state._history.historyIndex + 1)
          state._history.stack.push(snap)
          if (state._history.stack.length > MAX_HISTORY) {
            state._history.stack.shift()
          }
          state._history.historyIndex = state._history.stack.length - 1
        })
      },

      undo() {
        const { _history } = get()
        if (_history.historyIndex <= 0) return
        set((state) => {
          state._history.historyIndex -= 1
          const snap = JSON.parse(state._history.stack[state._history.historyIndex]) as ResumeState
          applyResumeStateToStore(state, snap)
        })
        get().saveToStorage()
      },

      redo() {
        const { _history } = get()
        if (_history.historyIndex >= _history.stack.length - 1) return
        set((state) => {
          state._history.historyIndex += 1
          const snap = JSON.parse(state._history.stack[state._history.historyIndex]) as ResumeState
          applyResumeStateToStore(state, snap)
        })
        get().saveToStorage()
      },

      canUndo: () => get()._history.historyIndex > 0,
      canRedo: () => get()._history.historyIndex < get()._history.stack.length - 1,
      historyLabel: () => {
        const { historyIndex, stack } = get()._history
        return `${historyIndex + 1} / ${stack.length}`
      },

      // --------------------------------------------------------
      // PERSONAL
      // --------------------------------------------------------
      updatePersonal(data) {
        set((state) => {
          Object.assign(state.personal, data)
        })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // ABOUT
      // --------------------------------------------------------
      updateAbout(text) {
        set((state) => { state.about = text })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // SKILLS
      // --------------------------------------------------------
      addSkill(skill) {
        const trimmed = skill.trim()
        if (!trimmed) return
        set((state) => { state.skills.push(trimmed) })
        get().snapshot()
        get().saveToStorage()
      },

      removeSkill(index) {
        set((state) => { state.skills.splice(index, 1) })
        get().snapshot()
        get().saveToStorage()
      },

      setSkills(skills) {
        set((state) => { state.skills = skills })
        get().snapshot()
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // EXPERIENCE
      // --------------------------------------------------------
      addExperience() {
        const id = generateId('exp')
        set((state) => {
          state.experience.push({ id, title: '', company: '', date: '', desc: '' })
        })
        get().snapshot()
        get().saveToStorage()
      },

      updateExperience(id, data) {
        set((state) => {
          const entry = state.experience.find((e) => e.id === id)
          if (entry) Object.assign(entry, data)
        })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      removeExperience(id) {
        set((state) => {
          state.experience = state.experience.filter((e) => e.id !== id)
        })
        get().snapshot()
        get().saveToStorage()
      },

      reorderExperience(ids) {
        set((state) => {
          const map = new Map(state.experience.map((e) => [e.id, e]))
          state.experience = ids.map((id) => map.get(id)!).filter(Boolean)
        })
      },

      // --------------------------------------------------------
      // EDUCATION
      // --------------------------------------------------------
      addEducation() {
        const id = generateId('edu')
        set((state) => {
          state.education.push({ id, degree: '', school: '', date: '', desc: '' })
        })
        get().snapshot()
        get().saveToStorage()
      },

      updateEducation(id, data) {
        set((state) => {
          const entry = state.education.find((e) => e.id === id)
          if (entry) Object.assign(entry, data)
        })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      removeEducation(id) {
        set((state) => {
          state.education = state.education.filter((e) => e.id !== id)
        })
        get().snapshot()
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // PROJECTS
      // --------------------------------------------------------
      addProject() {
        const id = generateId('proj')
        set((state) => {
          state.projects.push({ id, name: '', tech: '', date: '', desc: '' })
        })
        get().snapshot()
        get().saveToStorage()
      },

      updateProject(id, data) {
        set((state) => {
          const entry = state.projects.find((p) => p.id === id)
          if (entry) Object.assign(entry, data)
        })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      removeProject(id) {
        set((state) => {
          state.projects = state.projects.filter((p) => p.id !== id)
        })
        get().snapshot()
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // CUSTOM SECTIONS
      // --------------------------------------------------------
      addCustomSection() {
        const id = generateId('cs')
        set((state) => {
          state.customSections.push({ id, title: 'Custom Section', content: '' })
        })
        get().snapshot()
        get().saveToStorage()
      },

      updateCustomSection(id, data) {
        set((state) => {
          const entry = state.customSections.find((s) => s.id === id)
          if (entry) Object.assign(entry, data)
        })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      removeCustomSection(id) {
        set((state) => {
          state.customSections = state.customSections.filter((s) => s.id !== id)
        })
        get().snapshot()
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // COVER LETTER
      // --------------------------------------------------------
      updateCoverLetter(data) {
        set((state) => {
          Object.assign(state.coverLetter, data)
        })
        debounceSnapshot(get)
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // APPEARANCE
      // --------------------------------------------------------
      setTemplate(template) {
        set((state) => { state.template = template })
        get().snapshot()
        get().saveToStorage()
      },

      setAccentColor(color) {
        set((state) => { state.accentColor = color })
        get().snapshot()
        get().saveToStorage()
      },

      setResumeFont(font) {
        set((state) => {
          state.resumeFont = font
          // Manually picking a font clears any active preset pairing
          state.fontPairingId = null
        })
        get().snapshot()
        get().saveToStorage()
      },

      setHeadingFont(font) {
        set((state) => {
          state.headingFont = font
          state.fontPairingId = null
        })
        get().snapshot()
        get().saveToStorage()
      },

      setFontPairing(pairingId) {
        set((state) => { state.fontPairingId = pairingId })
        get().snapshot()
        get().saveToStorage()
      },

      setCustomPalette(palette) {
        set((state) => { state.customPalette = palette })
        get().snapshot()
        get().saveToStorage()
      },

      setPhotoDataUrl(url) {
        set((state) => { state.photoDataUrl = url })
        get().snapshot()
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // FILE
      // --------------------------------------------------------
      setFilename(name) {
        set((state) => { state.filename = name })
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // SECTION ORDER
      // --------------------------------------------------------
      reorderSections(order) {
        set((state) => { state.sectionOrder = order })
        get().saveToStorage()
      },

      // --------------------------------------------------------
      // PERSISTENCE
      // --------------------------------------------------------
      loadFromStorage() {
        const loaded = loadInitialState()
        set((state) => {
          applyResumeStateToStore(state, loaded)
        })
      },

      saveToStorage() {
        if (typeof window === 'undefined') return
        storageSet(STORAGE_KEYS.RESUME, extractResumeState(get()))
      },
    }
  }),
)

// ============================================================
// HELPERS
// ============================================================

function extractResumeState(store: ResumeStore): ResumeState {
  const {
    template, accentColor, resumeFont, headingFont, fontPairingId, filename, photoDataUrl,
    customPalette, personal, about, skills, experience, education, projects,
    customSections, coverLetter, sectionOrder,
  } = store
  return {
    template, accentColor, resumeFont, headingFont, fontPairingId, filename, photoDataUrl,
    customPalette, personal, about, skills, experience, education, projects,
    customSections, coverLetter, sectionOrder,
  }
}

function applyResumeStateToStore(state: ResumeStore, snap: ResumeState) {
  state.template = snap.template
  state.accentColor = snap.accentColor
  state.resumeFont = snap.resumeFont
  state.headingFont = snap.headingFont ?? null
  state.fontPairingId = snap.fontPairingId ?? null
  state.filename = snap.filename
  state.photoDataUrl = snap.photoDataUrl
  state.customPalette = snap.customPalette ?? null
  state.personal = snap.personal
  state.about = snap.about
  state.skills = snap.skills
  state.experience = snap.experience
  state.education = snap.education
  state.projects = snap.projects
  state.customSections = snap.customSections
  state.coverLetter = snap.coverLetter
  state.sectionOrder = snap.sectionOrder
}

// Debounced snapshot for text inputs
let snapTimer: ReturnType<typeof setTimeout> | null = null
function debounceSnapshot(get: () => ResumeStore) {
  if (snapTimer) clearTimeout(snapTimer)
  snapTimer = setTimeout(() => get().snapshot(), 600)
}
