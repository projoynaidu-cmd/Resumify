/**
 * Resume → DOCX export.
 *
 * Uses the `docx` npm package to produce a proper .docx file
 * from the resume state. The result is an ATS-friendly Word
 * document suitable for uploading to job portals.
 *
 * Import only in client code (uses browser Blob/URL APIs).
 */

import type { ResumeState } from '@/types'

/**
 * Generates a .docx Blob from resume state and triggers a browser download.
 * Dynamically imports `docx` so it is excluded from the initial bundle.
 */
export async function exportToDocx(state: ResumeState): Promise<void> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
  } = await import('docx')

  const p = state.personal
  const name = [p.fname, p.lname].filter(Boolean).join(' ')
  const contactLine = [p.email, p.phone, p.location, p.website, p.github]
    .filter(Boolean)
    .join(' | ')

  // ── Section divider helper ──────────────────────────────────
  function sectionHeading(text: string) {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '2d5a3d' },
      },
    })
  }

  // ── Bold+normal inline run helper ─────────────────────────
  function inlineRuns(bold: string, normal?: string) {
    return new Paragraph({
      children: [
        new TextRun({ text: bold, bold: true, size: 22 }),
        ...(normal ? [new TextRun({ text: `  ${normal}`, size: 20, color: '555555' })] : []),
      ],
    })
  }

  function body(text: string, indent = false) {
    return new Paragraph({
      text,
      indent: indent ? { left: 360 } : undefined,
      spacing: { after: 60 },
      run: { size: 20 },
    })
  }

  // ── Build document sections ────────────────────────────────
  const children = [
    // Name
    new Paragraph({
      text: name,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),

    // Job title
    ...(p.title
      ? [
          new Paragraph({
            text: p.title,
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            run: { size: 22, color: '2d5a3d' },
          }),
        ]
      : []),

    // Contact
    new Paragraph({
      text: contactLine,
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      run: { size: 18, color: '555555' },
    }),

    // Summary
    ...(state.about
      ? [
          sectionHeading('Professional Summary'),
          body(state.about),
        ]
      : []),

    // Skills
    ...(state.skills.length > 0
      ? [
          sectionHeading('Skills'),
          body(state.skills.join('  •  ')),
        ]
      : []),

    // Experience
    ...(state.experience.length > 0
      ? [
          sectionHeading('Experience'),
          ...state.experience.flatMap((exp) => [
            inlineRuns(exp.title, `@ ${exp.company}`),
            ...(exp.date
              ? [body(exp.date, false)]
              : []),
            ...(exp.desc
              ? exp.desc
                  .split('\n')
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((l) => body(l.startsWith('•') ? l : `• ${l}`, true))
              : []),
            new Paragraph({ text: '', spacing: { after: 120 } }),
          ]),
        ]
      : []),

    // Education
    ...(state.education.length > 0
      ? [
          sectionHeading('Education'),
          ...state.education.flatMap((edu) => [
            inlineRuns(edu.degree, `— ${edu.school}`),
            ...(edu.date ? [body(edu.date)] : []),
            ...(edu.desc ? [body(edu.desc, true)] : []),
            new Paragraph({ text: '', spacing: { after: 100 } }),
          ]),
        ]
      : []),

    // Projects
    ...(state.projects.length > 0
      ? [
          sectionHeading('Projects'),
          ...state.projects.flatMap((proj) => [
            inlineRuns(proj.name, proj.date ? `(${proj.date})` : ''),
            ...(proj.tech
              ? [body(`Stack: ${proj.tech}`, true)]
              : []),
            ...(proj.desc ? [body(proj.desc, true)] : []),
            new Paragraph({ text: '', spacing: { after: 100 } }),
          ]),
        ]
      : []),

    // Custom sections
    ...state.customSections.flatMap((sec) => {
      const lines = sec.content.split('\n').map((l) => l.trim()).filter(Boolean)
      return [
        sectionHeading(sec.title),
        ...lines.map((l) => body(`• ${l}`, true)),
        new Paragraph({ text: '' }),
      ]
    }),
  ]

  const doc = new Document({
    creator: 'Resumify',
    title: name,
    description: `Resume for ${name}`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          run: { font: 'Calibri', size: 20 },
          paragraph: { spacing: { after: 60, line: 280, lineRule: 'auto' as const } },
        },
      ],
    },
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.filename || 'resume'}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

