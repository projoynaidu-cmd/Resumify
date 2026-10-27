/**
 * PDF export using html2canvas + jsPDF.
 *
 * Both are dynamically imported so they are excluded from the initial
 * JavaScript bundle and only loaded when the user triggers an export.
 *
 * The on-screen preview lives inside `react-zoom-pan-pinch`, which sets
 * `transform: translate(...) scale(...)` on an ancestor. html2canvas 1.4
 * mis-places content when any ancestor is transformed and returns a white
 * canvas — the downloaded PDF is blank even though the preview looks fine.
 * Capture a clone mounted on `document.body`, outside that transform, then
 * slice the bitmap into A4 pages. Do not crop with html2canvas `y`/`scrollY`;
 * those offsets double-shift later pages into blank slices.
 */

export interface PdfExportOptions {
  /** Called with progress 0–100 and a human-readable status label */
  onProgress?: (percent: number, label: string) => void
}

const A4_MM = { w: 210, h: 297 } as const
/** Width of the resume preview wrapper in CSS pixels (A4 @ 96dpi) */
const PREVIEW_CSS_PX = 794
const CAPTURE_SCALE = 2

interface CaptureMount {
  clone: HTMLElement
  restore: () => void
}

/**
 * Moves template CSS (keyed on the source id) onto a body-level clone and
 * hides that clone under the export overlay. The id is taken off the live
 * node so there is only one match while html2canvas runs.
 */
function mountCaptureClone(source: HTMLElement): CaptureMount {
  const clone = source.cloneNode(true) as HTMLElement
  const originalId = source.id
  if (originalId) source.removeAttribute('id')

  // Sit in the viewport, in document coordinates html2canvas already uses
  // (getBoundingClientRect + page scroll). Fixed + a non-zero scrollY makes
  // those two systems disagree and the capture comes back white.
  const host = document.createElement('div')
  host.setAttribute('data-pdf-capture', 'true')
  host.style.cssText = [
    'position:absolute',
    `top:${window.scrollY}px`,
    `left:${window.scrollX}px`,
    `width:${PREVIEW_CSS_PX}px`,
    'margin:0',
    'padding:0',
    'background:#ffffff',
    'z-index:1',
    'pointer-events:none',
  ].join(';')

  clone.style.transform = 'none'
  clone.style.width = `${PREVIEW_CSS_PX}px`
  clone.style.maxWidth = `${PREVIEW_CSS_PX}px`
  clone.style.margin = '0'
  clone.style.boxSizing = 'border-box'

  host.appendChild(clone)
  document.body.appendChild(host)

  return {
    clone,
    restore: () => {
      host.remove()
      if (originalId) source.id = originalId
    },
  }
}

async function waitForClone(clone: HTMLElement): Promise<void> {
  const imgs = Array.from(clone.querySelectorAll('img'))
  await Promise.all(
    imgs.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return
      try {
        await img.decode()
      } catch {
        // A broken photo should not fail the whole export.
      }
    }),
  )
  if (document.fonts?.ready) await document.fonts.ready
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
}

function sliceCanvasToPdf(
  canvas: HTMLCanvasElement,
  pdf: import('jspdf').jsPDF,
  report: (percent: number, label: string) => void,
): void {
  const pageSlicePx = Math.max(1, Math.floor(canvas.width * (A4_MM.h / A4_MM.w)))
  const pageCount = Math.ceil(canvas.height / pageSlicePx)

  let offset = 0
  let page = 0
  while (offset < canvas.height) {
    const sliceH = Math.min(pageSlicePx, canvas.height - offset)
    const slice = document.createElement('canvas')
    slice.width = canvas.width
    slice.height = pageSlicePx
    const ctx = slice.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context is unavailable')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, slice.width, slice.height)
    ctx.drawImage(
      canvas,
      0,
      offset,
      canvas.width,
      sliceH,
      0,
      0,
      canvas.width,
      sliceH,
    )

    if (page > 0) pdf.addPage()
    pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_MM.w, A4_MM.h)
    offset += pageSlicePx
    page += 1
    report(30 + Math.round((page / pageCount) * 60), `Rendering page ${page} of ${pageCount}…`)
  }
}

/**
 * Exports an HTML element to a multi-page A4 PDF file.
 *
 * @param element  — The DOM element to capture (the on-screen preview)
 * @param filename — Output filename (`.pdf` appended if missing)
 * @param options  — `onProgress` callback
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  { onProgress }: PdfExportOptions = {},
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const report = (pct: number, label: string) => onProgress?.(pct, label)
  report(8, 'Preparing…')

  const { clone, restore } = mountCaptureClone(element)

  try {
    await waitForClone(clone)
    if (clone.scrollHeight < 2) {
      throw new Error('Resume preview has no layout to export')
    }

    report(18, 'Rendering…')
    const canvas = await html2canvas(clone, {
      scale: CAPTURE_SCALE,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      // Iframe must be tall enough for the whole resume. The default is the
      // viewport, which clips everything past the first screen.
      windowWidth: Math.max(window.innerWidth, PREVIEW_CSS_PX),
      windowHeight: Math.max(
        window.innerHeight,
        Math.ceil(window.scrollY + clone.scrollHeight + 32),
      ),
      imageTimeout: 15000,
    })

    if (canvas.width < 2 || canvas.height < 2) {
      throw new Error('PDF capture was empty')
    }

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    })

    sliceCanvasToPdf(canvas, pdf, report)

    report(94, 'Saving file…')
    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    pdf.save(safeName)
    report(100, 'Done!')
  } finally {
    restore()
  }
}
