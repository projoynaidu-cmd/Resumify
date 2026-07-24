/**
 * PDF export using html2canvas + jsPDF.
 *
 * Both are dynamically imported so they are excluded from the initial
 * JavaScript bundle and only loaded when the user triggers an export.
 *
 * Supports multi-page documents by slicing the rendered element into
 * A4-height chunks and adding pages accordingly.
 */

export interface PdfExportOptions {
  /** Called with progress 0–100 and a human-readable status label */
  onProgress?: (percent: number, label: string) => void
}

const A4_MM = { w: 210, h: 297 } as const
/** Width of the resume preview wrapper in CSS pixels */
const PREVIEW_CSS_PX = 794

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * Exports an HTML element to a multi-page A4 PDF file.
 *
 * @param element  — The DOM element to capture (must be visible)
 * @param filename — Output filename (`.pdf` appended if missing)
 * @param options  — `onProgress` callback
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  { onProgress }: PdfExportOptions = {},
): Promise<void> {
  // Dynamic imports — excluded from initial bundle
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const report = (pct: number, label: string) => onProgress?.(pct, label)

  // ── Temporarily force to 794 px width for consistent capture ──────────
  const prevTransform = element.style.transform
  const prevWidth = element.style.width
  element.style.transform = 'none'
  element.style.width = `${PREVIEW_CSS_PX}px`

  // Allow the browser to re-flow before capturing
  await sleep(120)

  const pageHeightPx = Math.round(PREVIEW_CSS_PX * (A4_MM.h / A4_MM.w))
  const totalH = element.scrollHeight
  const pageCount = Math.ceil(totalH / pageHeightPx)

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  })

  try {
    for (let page = 0; page < pageCount; page++) {
      const yOffset = page * pageHeightPx
      const clipH = Math.min(pageHeightPx, totalH - yOffset)
      const pct = 20 + Math.round((page / pageCount) * 65)
      report(pct, `Rendering page ${page + 1} of ${pageCount}…`)

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: PREVIEW_CSS_PX,
        height: clipH,
        windowWidth: PREVIEW_CSS_PX,
        y: yOffset,
        scrollY: -yOffset,
        imageTimeout: 0,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.92)

      if (page > 0) pdf.addPage()

      // Height of this slice in mm, proportional to A4
      const sliceMm = (clipH / pageHeightPx) * A4_MM.h
      pdf.addImage(imgData, 'JPEG', 0, 0, A4_MM.w, sliceMm, undefined, 'FAST')
    }

    report(93, 'Saving file…')
    await sleep(200)

    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    pdf.save(safeName)

    report(100, 'Done!')
    await sleep(350)
  } finally {
    // Always restore original styles
    element.style.transform = prevTransform
    element.style.width = prevWidth
  }
}
