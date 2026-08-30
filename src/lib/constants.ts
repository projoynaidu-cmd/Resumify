import type {
  TemplateOption,
  FontOption,
  FontPairing,
  AccentColor,
  SectionMeta,
  ResumeState,
  SectionKey,
} from '@/types'

export const TEMPLATES: TemplateOption[] = [
  { id: 'classic', label: 'Classic', description: 'Traditional sidebar layout' },
  { id: 'modern', label: 'Modern', description: 'Clean with accent headers' },
  { id: 'minimal', label: 'Minimal', description: 'Clean, typography-first' },
  { id: 'executive', label: 'Executive', description: 'Formal business style' },
  { id: 'creative', label: 'Creative', description: 'Bold sidebar design' },
  { id: 'compact', label: 'Compact', description: 'Two-column, space-efficient' },
  { id: 'timeline', label: 'Timeline', description: 'Vertical timeline for experience' },
  { id: 'elegant', label: 'Elegant', description: 'Refined serif, generous whitespace' },
  { id: 'technical', label: 'Technical', description: 'Monospace accents for engineers' },
  { id: 'bold', label: 'Bold', description: 'Large type, high-contrast blocks' },
]

export const FONTS: FontOption[] = [
  { label: 'DM Sans', value: "'DM Sans', sans-serif", name: 'DM Sans', sample: 'Clean & Modern' },
  { label: 'Inter', value: "'Inter', sans-serif", name: 'Inter', sample: 'Tech Favorite' },
  { label: 'Lora', value: "'Lora', serif", name: 'Lora', sample: 'Elegant Serif' },
  { label: 'Playfair', value: "'Playfair Display', serif", name: 'Playfair', sample: 'Classic Serif' },
  { label: 'Nunito', value: "'Nunito', sans-serif", name: 'Nunito', sample: 'Friendly Round' },
  { label: 'Raleway', value: "'Raleway', sans-serif", name: 'Raleway', sample: 'Geometric Style' },
  { label: 'Source Serif', value: "'Source Serif 4', serif", name: 'Source Serif', sample: 'Editorial' },
  { label: 'DM Mono', value: "'DM Mono', monospace", name: 'DM Mono', sample: 'Technical' },
]

/**
 * Curated heading + body font pairings. Selecting a pairing sets
 * both `headingFont` and `resumeFont` together for a cohesive look,
 * rather than the user picking a single font for everything.
 */
export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'classic-editorial',
    label: 'Classic Editorial',
    heading: "'Playfair Display', serif",
    headingName: 'Playfair Display',
    body: "'Source Serif 4', serif",
    bodyName: 'Source Serif',
    description: 'Timeless serif pairing for traditional industries',
  },
  {
    id: 'modern-tech',
    label: 'Modern Tech',
    heading: "'DM Sans', sans-serif",
    headingName: 'DM Sans',
    body: "'Inter', sans-serif",
    bodyName: 'Inter',
    description: 'Crisp sans-serif for startups and engineering roles',
  },
  {
    id: 'friendly-approachable',
    label: 'Friendly & Approachable',
    heading: "'Nunito', sans-serif",
    headingName: 'Nunito',
    body: "'Nunito', sans-serif",
    bodyName: 'Nunito',
    description: 'Rounded, warm tone for people-facing roles',
  },
  {
    id: 'sharp-geometric',
    label: 'Sharp & Geometric',
    heading: "'Raleway', sans-serif",
    headingName: 'Raleway',
    body: "'DM Sans', sans-serif",
    bodyName: 'DM Sans',
    description: 'Distinctive headings with clean readable body',
  },
  {
    id: 'engineer-mono',
    label: "Engineer's Mono",
    heading: "'DM Mono', monospace",
    headingName: 'DM Mono',
    body: "'Inter', sans-serif",
    bodyName: 'Inter',
    description: 'Monospace headings for a technical signature look',
  },
  {
    id: 'elegant-serif',
    label: 'Elegant Serif',
    heading: "'Lora', serif",
    headingName: 'Lora',
    body: "'Lora', serif",
    bodyName: 'Lora',
    description: 'Soft, refined serif throughout',
  },
]

export const ACCENT_COLORS: AccentColor[] = [
  { label: 'Forest Green', value: '#2d5a3d' },
  { label: 'Royal Blue', value: '#1a56db' },
  { label: 'Crimson', value: '#c0392b' },
  { label: 'Purple', value: '#6d28d9' },
  { label: 'Teal', value: '#0891b2' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Slate', value: '#334155' },
]

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  personal: { key: 'personal', label: 'Personal Info', icon: 'User', draggable: false },
  appearance: { key: 'appearance', label: 'Appearance', icon: 'Palette', draggable: false },
  about: { key: 'about', label: 'About / Summary', icon: 'Info', draggable: true },
  skills: { key: 'skills', label: 'Skills', icon: 'Star', draggable: true },
  experience: { key: 'experience', label: 'Experience', icon: 'Briefcase', draggable: true },
  education: { key: 'education', label: 'Education', icon: 'GraduationCap', draggable: true },
  projects: { key: 'projects', label: 'Projects', icon: 'Code', draggable: true },
  custom: { key: 'custom', label: 'Custom Sections', icon: 'PuzzlePiece', draggable: true },
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'personal',
  'appearance',
  'about',
  'skills',
  'experience',
  'education',
  'projects',
  'custom',
]

export const DEFAULT_RESUME_STATE: ResumeState = {
  template: 'classic',
  accentColor: '#2d5a3d',
  resumeFont: "'DM Sans', sans-serif",
  headingFont: null,
  fontPairingId: null,
  filename: 'my-resume',
  photoDataUrl: null,
  customPalette: null,
  personal: {
    fname: 'Jane',
    lname: 'Doe',
    title: 'Senior Software Engineer',
    email: 'jane@example.com',
    phone: '+1 555 000 0000',
    location: 'New York, NY',
    website: 'linkedin.com/in/jane',
    github: 'github.com/jane',
    twitter: '',
  },
  about:
    'Passionate software engineer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud architecture. Proven track record of delivering high-impact products.',
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'GraphQL', 'Docker', 'AWS'],
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      date: 'Jan 2022 – Present',
      desc: 'Led development of a microservices architecture serving 2M+ daily users. Reduced API latency by 40% through caching and query optimization. Mentored a team of 4 junior engineers.',
    },
    {
      id: 'exp-2',
      title: 'Software Engineer',
      company: 'StartupXYZ',
      date: 'Mar 2019 – Dec 2021',
      desc: 'Built core product features using React and Node.js. Implemented CI/CD pipelines cutting deployment time by 60%.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. Computer Science',
      school: 'MIT',
      date: '2015 – 2019',
      desc: "Dean's List. Thesis: Distributed Systems for Real-Time Analytics.",
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenMetrics',
      tech: 'React, Node.js, PostgreSQL',
      date: '2023',
      desc: 'Open-source analytics dashboard with 1.2k GitHub stars. Real-time streaming and customizable charts.',
    },
    {
      id: 'proj-2',
      name: 'AICodeReview',
      tech: 'Python, OpenAI API, FastAPI',
      date: '2022',
      desc: 'Automated code review tool reducing PR review time by 35%.',
    },
  ],
  customSections: [],
  coverLetter: {
    to: '',
    company: '',
    position: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    body: '',
  },
  sectionOrder: DEFAULT_SECTION_ORDER,
}

export const LOCAL_STORAGE_KEY = 'Resumify_v2'
export const PALETTE_STORAGE_KEY = 'Resumify_palettes'

export const SKILL_LEVEL_PERCENTAGES = [95, 88, 82, 75, 70, 65, 60, 55]

export const MAX_CUSTOM_PALETTES = 8

