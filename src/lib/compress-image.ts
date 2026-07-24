/**
 * Client-side image compression using canvas.
 *
 * Takes a File object and returns a square-cropped, resized JPEG
 * as a base64 data URL. Safe to call only in browser context.
 */

export interface CompressOptions {
  /** Output square dimension in px (default: 200) */
  size?: number
  /** JPEG quality 0–1 (default: 0.85) */
  quality?: number
  /** Max input file size in bytes (default: 3 MB) */
  maxFileSize?: number
}

export class ImageTooLargeError extends Error {
  constructor(limitMb: number) {
    super(`Image must be smaller than ${limitMb}MB`)
    this.name = 'ImageTooLargeError'
  }
}

export class ImageReadError extends Error {
  constructor() {
    super('Failed to read image file')
    this.name = 'ImageReadError'
  }
}

export function compressProfileImage(
  file: File,
  { size = 200, quality = 0.85, maxFileSize = 3 * 1024 * 1024 }: CompressOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxFileSize) {
      reject(new ImageTooLargeError(Math.round(maxFileSize / 1024 / 1024)))
      return
    }

    const reader = new FileReader()

    reader.onerror = () => reject(new ImageReadError())

    reader.onload = (ev) => {
      const img = new Image()

      img.onerror = () => reject(new ImageReadError())

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas 2D context unavailable'))
            return
          }

          // Centre-crop to square
          const min = Math.min(img.width, img.height)
          const srcX = (img.width - min) / 2
          const srcY = (img.height - min) / 2

          ctx.drawImage(img, srcX, srcY, min, min, 0, 0, size, size)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch (err) {
          reject(err)
        }
      }

      img.src = ev.target!.result as string
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Returns approximate size in KB of a base64 data URL.
 */
export function dataUrlSizeKb(dataUrl: string): number {
  // base64 encodes 3 bytes → 4 chars; strip prefix
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.round((base64.length * 3) / 4 / 1024)
}
