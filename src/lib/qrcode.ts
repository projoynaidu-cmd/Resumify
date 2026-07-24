/**
 * QR code generation for public resume share links.
 * Uses the `qrcode` package which works in both Node.js and browser.
 * Returns a PNG data URL.
 */

/**
 * Generates a QR code PNG as a base64 data URL for the given URL string.
 * The QR includes error correction level M (can restore ~15% of the image).
 */
export async function generateQrDataUrl(url: string, size = 200): Promise<string> {
  const QRCode = await import('qrcode')
  return QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#1a1814',
      light: '#ffffff',
    },
  })
}
