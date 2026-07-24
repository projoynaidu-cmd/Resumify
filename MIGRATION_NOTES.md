# ResumeForge v2 — Next.js Migration Notes

## Overview

Complete migration from a 1,775-line single-file HTML/CSS/JS application to a
production-ready Next.js 15 + TypeScript SaaS application.

---

## Step 1: Feature Audit

All features from the original have been preserved and improved:

| Feature | Original | Next.js Port | Improvement |
|---|---|---|---|
| Resume Builder | Global mutable `state` object | Zustand store with Immer | Reactive, immutable, testable |
| Multiple Templates (6) | String `innerHTML` injection | Typed React components | Type-safe, no XSS risk |
| Live Preview | DOM `innerHTML` mutation | React re-renders | Efficient, diffed updates |
| Theme Switcher (dark/light) | `data-theme` attribute + CSS vars | Zustand + `document.classList` | Proper SSR hydration |
| Font Switcher | DOM `style.setProperty` | Zustand + CSS var sync on mount | Persisted, reactive |
| ATS Score Checker | Imperative DOM manipulation | `useAtsScore` hook + animated SVG | Memoized, reusable |
| Drag & Drop Reordering | SortableJS CDN | `@dnd-kit/sortable` | Accessible, typed, no CDN |
| Skills Tag Input | Vanilla event listeners | Controlled React component | Proper keyboard handling |
| Experience CRUD | DOM re-render loop | Array state + unique IDs | Stable keys, no flicker |
| Education CRUD | DOM re-render loop | Array state + unique IDs | As above |
| Projects CRUD | DOM re-render loop | Array state + unique IDs | As above |
| Custom Sections CRUD | DOM re-render loop | Array state + unique IDs | As above |
| Photo Upload | FileReader + canvas | `compressImage` utility | Extracted, reusable |
| Cover Letter Builder | Hidden panel + textarea | Dedicated component + Zustand | Clean separation |
| LocalStorage Auto Save | `setTimeout` debounce | Store method + debounce | Centralized |
| Undo / Redo System | Manual stack arrays | Zustand history slice + Immer | 50-step history |
| Keyboard Shortcuts | `document.addEventListener` | `useKeyboardShortcuts` hook | Properly cleaned up |
| PDF Export | html2canvas + jsPDF CDN | Dynamic `import()` of same libs | Code-split, lazy-loaded |
| Print Resume | `window.print()` | Same (browser native) | Preserved |
| HTML Upload Drop Zone | dragover/drop listeners | React event handlers | Declarative |
| Toast Notifications | DOM `createElement` | Zustand toast queue + Framer Motion | Animated, accessible |
| Loading Overlay | CSS class toggle | Framer Motion `AnimatePresence` | Smooth transitions |

---

## Step 2: Folder Structure

```
src/
├── app/
│   ├── layout.tsx          # Root HTML shell, metadata, font links
│   ├── page.tsx            # Dynamic import entry point ('use client')
│   └── globals.css         # Design tokens (CSS vars), template CSS, base styles
│
├── components/
│   ├── layout/
│   │   ├── Providers.tsx       # Theme sync + Toast container wrapper
│   │   ├── ResumeBuilder.tsx   # Top-level layout (topbar + panels)
│   │   └── Topbar.tsx          # Fixed header: logo, view tabs, undo/redo, export
│   │
│   ├── editor/
│   │   ├── EditorPanel.tsx         # Left panel orchestrator + DnD context
│   │   ├── SortableSectionCard.tsx # Collapsible card with drag handle
│   │   ├── AtsScorePanel.tsx       # ATS score checker with animated ring
│   │   ├── CoverLetterEditor.tsx   # Cover letter form + AI draft
│   │   ├── HtmlUploadDropZone.tsx  # Drag & drop HTML upload
│   │   ├── PhotoUpload.tsx         # Profile photo upload + compress
│   │   └── sections/
│   │       ├── PersonalSection.tsx
│   │       ├── AppearanceSection.tsx   # Template + color + font pickers
│   │       ├── AboutSection.tsx
│   │       ├── SkillsSection.tsx       # Tag input component
│   │       ├── ExperienceSection.tsx
│   │       ├── EducationSection.tsx
│   │       ├── ProjectsSection.tsx
│   │       └── CustomSectionsSection.tsx
│   │
│   ├── preview/
│   │   ├── PreviewPanel.tsx        # Right panel, scale-to-fit logic
│   │   ├── ResumePreview.tsx       # Template dispatcher + CSS var sync
│   │   └── CoverLetterPreview.tsx  # Live cover letter preview
│   │
│   ├── templates/
│   │   ├── TemplateHelpers.tsx     # Avatar, EntryDesc, TagsRow, CustomSectionsRenderer
│   │   ├── ClassicTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   ├── ExecutiveTemplate.tsx
│   │   ├── CreativeTemplate.tsx
│   │   └── CompactTemplate.tsx
│   │
│   └── shared/
│       ├── FormField.tsx       # FormField, FormRow, TextInput, Textarea
│       ├── RepeaterItem.tsx    # RepeaterItem, AddButton
│       ├── Toast.tsx           # Animated toast container
│       ├── LoadingOverlay.tsx  # PDF export progress overlay
│       └── AutosaveBadge.tsx   # Pulsing autosave indicator
│
├── hooks/
│   ├── useKeyboardShortcuts.ts   # Ctrl+Z / Ctrl+Y undo-redo
│   ├── useAutoSave.ts            # Debounced localStorage save
│   ├── usePdfExport.ts           # PDF export with progress callbacks
│   └── useAtsScore.ts            # Memoized ATS result
│
├── lib/
│   ├── constants.ts    # TEMPLATES, FONTS, ACCENT_COLORS, DEFAULT_STATE
│   └── schemas.ts      # Zod validation schemas
│
├── store/
│   ├── resume-store.ts   # All resume data + history + CRUD actions
│   ├── ui-store.ts       # Theme, view, toasts, export state
│   └── index.ts          # Barrel export
│
├── types/
│   └── index.ts          # All TypeScript interfaces
│
└── utils/
    └── index.ts          # cn(), generateId(), compressImage(), exportToPdf(), calculateAtsScore(), generateCoverLetterTemplate()
```

---

## Step 3: TypeScript Interfaces

Key types defined in `src/types/index.ts`:

- `PersonalInfo` — all personal fields
- `ExperienceEntry / EducationEntry / ProjectEntry / CustomSection` — each with stable `id: string`
- `CoverLetter` — cover letter metadata + body
- `ResumeState` — complete persisted state shape
- `TemplateId` — `'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'compact'`
- `SectionKey` — typed section identifiers for drag ordering
- `AtsCheck / AtsResult` — ATS score output
- `Toast / ToastType` — notification system
- `UIState / ActiveView` — non-persisted UI state

---

## Step 4: Zustand Store Architecture

**`resume-store.ts`** — persisted, Immer-patched:
- Full CRUD for experience, education, projects, custom sections
- `snapshot()` / `undo()` / `redo()` with 50-step history stack
- `saveToStorage()` / `loadFromStorage()` for localStorage
- Debounced snapshot on text input (600ms), immediate on structural changes

**`ui-store.ts`** — ephemeral:
- `activeView: 'resume' | 'coverletter'`
- `theme: 'light' | 'dark'` + DOM sync
- `openSections: Set<string>` for accordion state
- `isExporting / exportProgress / exportLabel` for PDF overlay
- `toasts[]` with auto-dismiss (3.5s)

---

## Step 5: React Component Breakdown

- **~28 components** total, each with single responsibility
- All forms are fully controlled (no uncontrolled inputs or `ref.current.value`)
- All lists use stable IDs (not array indices) for React keys
- Heavy components (`html2canvas`, `jspdf`) are dynamically imported on demand
- All 6 templates are `memo()`-wrapped to prevent unnecessary re-renders
- Template CSS stays in `globals.css` (template class names must survive Tailwind purge)

---

## Step 6: CSS Strategy

- **Design tokens**: All CSS variables preserved in `:root` and `.dark` classes in `globals.css`
- **App UI**: Tailwind utility classes for all editor/preview chrome
- **Resume templates**: Plain CSS in `globals.css` with `.tpl-*` prefix — intentionally not Tailwind to ensure pixel-perfect PDF export fidelity
- **Tailwind theme**: Extended with CSS var references so `bg-[var(--accent)]` works ergonomically

---

## Step 7: Performance

- `next/dynamic` with `ssr: false` for the entire builder (client-only, localStorage-dependent)
- `memo()` on all 6 template components + `ResumePreview` dispatcher
- `useMemo` on ATS score (re-computes only when resume data changes)
- Dynamic `import()` for `html2canvas` and `jspdf` — only loaded when user clicks Export
- Zustand subscriptions are granular — components subscribe to only the slices they need
- Debounced history snapshots (600ms) prevent thrashing on every keystroke

---

## Step 8: Breaking Changes / Migration Gotchas

1. **No CDN scripts**: SortableJS → `@dnd-kit`, html2canvas/jsPDF → dynamic imports
2. **Stable IDs required**: All repeater entries now have a generated `id` field — old localStorage saves without IDs will fall back to defaults
3. **`ssr: false`** requires the page to be a Client Component (`'use client'`) in Next.js 15 App Router
4. **Template CSS is global**: Tailwind's purging does not apply to `.tpl-*` classes — they live in `globals.css` and are safe
5. **Font loading**: Switched from `next/font/google` to standard `<link>` tags to avoid build-time network dependency; swap back to `next/font` in production for optimal performance
6. **Photo data URL**: Stored in Zustand + localStorage as a base64 JPEG (200×200, quality 0.85) — large photos won't exceed 5KB

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:3000

# 4. Type check
npm run type-check

# 5. Production build
npm run build && npm start
```

### Optional: Re-enable `next/font` in production

Replace the `<link>` tags in `layout.tsx` with:

```tsx
import { DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-dm-sans', display: 'swap' })
// … etc
```

Then add `className={`${dmSans.variable} ...`}` to `<body>`. This gives you font subsetting, preloading, and zero layout shift.
