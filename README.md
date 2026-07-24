# ResumeForge v2

> A production-ready, open-source resume builder built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

![ResumeForge](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

---

## Features

| Feature | Details |
|---|---|
| **6 Resume Templates** | Classic, Modern, Minimal, Executive, Creative, Compact |
| **Live Preview** | Reactive A4-scaled preview, rescales to any viewport |
| **Theme Switcher** | Light / dark mode, persisted to localStorage |
| **Font Switcher** | 8 Google Fonts, applied live to the preview |
| **Accent Color Picker** | 8 presets + custom colour input |
| **ATS Score Checker** | 12-point weighted checklist with animated ring |
| **Drag & Drop Reordering** | Section-level reorder via @dnd-kit |
| **Skills Tag Input** | Enter or comma to add, backspace to remove |
| **Experience CRUD** | Add / edit / delete with confirmation dialog |
| **Education CRUD** | Add / edit / delete with confirmation dialog |
| **Projects CRUD** | Add / edit / delete with confirmation dialog |
| **Custom Sections** | Unlimited free-form sections |
| **Photo Upload** | Client-side square-crop + JPEG compression |
| **Cover Letter Builder** | AI-drafted template + live preview |
| **Auto-save** | Versioned localStorage with schema migration |
| **Undo / Redo** | 50-step history, Ctrl+Z / Ctrl+Y keyboard shortcuts |
| **PDF Export** | Multi-page A4, dynamically imported html2canvas+jsPDF |
| **Print** | Native browser print with print-only CSS |
| **Plain-text Export** | Clipboard copy + .txt download for ATS paste |
| **Reset** | Two-step confirmation wipe with toast feedback |
| **Storage Monitor** | Live localStorage usage badge with overflow warning |
| **Error Boundary** | Friendly error page with digest ID |
| **404 Page** | Branded not-found page |

---

## Quick Start

```bash
# 1. Clone / unzip the project
cd resumeforge

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.local.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run type-check` | TypeScript check without emit |
| `npm run lint` | ESLint with Next.js rules |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root HTML shell + font links + metadata
│   ├── page.tsx            # Entry — dynamic imports ResumeBuilder
│   ├── globals.css         # Design tokens, template CSS, base resets
│   ├── loading.tsx         # Route-level loading skeleton
│   ├── not-found.tsx       # 404 page
│   └── error.tsx           # Error boundary
│
├── components/
│   ├── layout/             # App shell
│   │   ├── Providers.tsx       # Theme sync + toast wrapper
│   │   ├── ResumeBuilder.tsx   # Two-panel layout orchestrator
│   │   └── Topbar.tsx          # Fixed header with all actions
│   │
│   ├── editor/             # Left panel — all input components
│   │   ├── AtsScorePanel.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── CoverLetterEditor.tsx
│   │   ├── EditorPanel.tsx
│   │   ├── FilenameInput.tsx
│   │   ├── FontPicker.tsx
│   │   ├── HtmlUploadDropZone.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── SortableSectionCard.tsx
│   │   ├── TemplatePicker.tsx   # Visual grid with SVG thumbnails
│   │   └── sections/
│   │       ├── AboutSection.tsx
│   │       ├── AppearanceSection.tsx
│   │       ├── CustomSectionsSection.tsx
│   │       ├── EducationSection.tsx
│   │       ├── ExperienceSection.tsx
│   │       ├── PersonalSection.tsx
│   │       ├── ProjectsSection.tsx
│   │       └── SkillsSection.tsx
│   │
│   ├── preview/            # Right panel — live preview
│   │   ├── CoverLetterPreview.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── ResumePreview.tsx
│   │
│   ├── templates/          # 6 resume template components
│   │   ├── ClassicTemplate.tsx
│   │   ├── CompactTemplate.tsx
│   │   ├── CreativeTemplate.tsx
│   │   ├── ExecutiveTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   └── TemplateHelpers.tsx
│   │
│   ├── ui/                 # Reusable primitive components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx          # CVA variants: primary/secondary/ghost/danger/accent
│   │   ├── ConfirmDialog.tsx   # Accessible modal with focus trap
│   │   ├── Divider.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx           # Input + Textarea with label/error
│   │   ├── ProgressRing.tsx    # SVG animated circular progress
│   │   ├── Skeleton.tsx        # Shimmer loading placeholders
│   │   └── Tooltip.tsx
│   │
│   └── shared/             # Cross-cutting components
│       ├── AutosaveBadge.tsx
│       ├── FormField.tsx
│       ├── LoadingOverlay.tsx
│       ├── RepeaterItem.tsx
│       ├── StorageInfo.tsx
│       └── Toast.tsx
│
├── hooks/                  # Custom React hooks
│   ├── useAtsScore.ts          # Memoized ATS result
│   ├── useAutoSave.ts          # Debounced save scheduler
│   ├── useClipboard.ts         # Clipboard write with feedback state
│   ├── useDebounce.ts          # Value debounce + debounced callback
│   ├── useKeyboardShortcuts.ts # Ctrl+Z / Ctrl+Y
│   ├── useLocalStorage.ts      # SSR-safe cross-tab typed localStorage
│   ├── usePdfExport.ts         # (legacy) delegates to lib/pdf
│   ├── usePreviewScale.ts      # Reactive A4 scale factor
│   ├── useResizeObserver.ts    # ResizeObserver wrapper
│   ├── useResetResume.ts       # Two-step reset with confirmation
│   ├── useResumeExport.ts      # Unified PDF + print
│   └── useTheme.ts             # Theme toggle abstraction
│
├── lib/                    # Pure domain logic (no React)
│   ├── ats.ts                  # ATS score calculation
│   ├── compress-image.ts       # Canvas image compression
│   ├── constants.ts            # Templates, fonts, colours, defaults
│   ├── cover-letter.ts         # Cover letter body generator
│   ├── pdf.ts                  # Multi-page A4 PDF export
│   ├── schemas.ts              # Zod validation schemas
│   ├── storage.ts              # Versioned localStorage abstraction
│   └── text-export.ts          # Plain-text + clipboard export
│
├── store/
│   ├── resume-store.ts     # All resume data, CRUD, 50-step undo/redo
│   ├── ui-store.ts         # Theme, toasts, view, export progress
│   └── index.ts
│
├── types/
│   └── index.ts            # All TypeScript interfaces
│
├── utils/
│   └── index.ts            # cn(), generateId(), sleep(), arrayMove()
│
└── env.ts                  # Typed environment config
```

---

## Architecture Decisions

### State Management

Two Zustand stores keep concerns separated:

- **`resume-store`** — all resume content + history stack (persisted via `lib/storage`)
- **`ui-store`** — ephemeral UI state: theme, toasts, section open/close, export progress

Both use Immer for safe mutations. The resume store maintains a 50-entry undo/redo stack using JSON serialisation snapshots with 600 ms debounce on text inputs.

### Template CSS Strategy

Template classes (`.tpl-classic`, `.r-header`, etc.) live in `globals.css` as plain CSS, **not Tailwind utilities**. This is intentional:

1. They must survive Tailwind's purge pass
2. They need to render identically in both the live preview and the html2canvas PDF snapshot
3. CSS variables (`--resume-accent`, `--resume-font`) are updated imperatively via `document.documentElement.style.setProperty` when the user changes theme/font — no React re-render needed

### PDF Export

`lib/pdf.ts` dynamically imports `html2canvas` and `jsPDF` — these two libraries together are ~250 KB and are **never included in the initial bundle**. They are loaded on-demand when the user first clicks Export.

Multi-page export works by:
1. Forcing the preview element to its natural 794 px CSS width
2. Calculating `pageHeightPx = 794 * (297/210)` (A4 aspect ratio)
3. Rendering each page slice with `html2canvas` at `scale: 2` (retina)
4. Stitching pages into a single PDF with `jsPDF`

### Storage Versioning

`lib/storage.ts` wraps every localStorage entry in `{ v: 2, ts: Date.now(), data: T }`. If the schema version doesn't match on read, the entry is silently discarded and the app falls back to `DEFAULT_RESUME_STATE`. This prevents crashes when the data shape changes between app versions.

---

## Adding a New Template

1. Create `src/components/templates/MyTemplate.tsx` — export a `memo()`-wrapped component reading from `useResumeStore`
2. Add `mytemplate` to the `TemplateId` union in `src/types/index.ts`
3. Add it to `TEMPLATES` in `src/lib/constants.ts`
4. Add it to `TEMPLATE_MAP` in `src/components/preview/ResumePreview.tsx`
5. Add a thumbnail SVG to `THUMBNAILS` in `src/components/editor/TemplatePicker.tsx`
6. Add `.tpl-mytemplate` CSS rules to `src/app/globals.css`

---

## Adding a New Section

1. Create `src/components/editor/sections/MySection.tsx`
2. Add the section key to `SectionKey` in `src/types/index.ts`
3. Add metadata to `SECTION_META` in `src/lib/constants.ts`
4. Add initial state to `DEFAULT_RESUME_STATE` in `src/lib/constants.ts`
5. Add store actions to `resume-store.ts`
6. Register in `SECTION_COMPONENTS` map in `EditorPanel.tsx`
7. Export from `src/components/editor/sections/index.ts`

---

## Deployment

### Vercel (recommended)

```bash
npx vercel --prod
```

No additional configuration needed — the app is fully static (SSG) since it uses `ssr: false` dynamic imports and `localStorage` for all persistence.

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable standalone output in `next.config.ts`:
```ts
output: 'standalone'
```

---

## License

MIT © ResumeForge Contributors
