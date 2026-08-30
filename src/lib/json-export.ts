/**
 * Resume JSON export / import.
 *
 * The exported JSON is a versioned envelope containing the full
 * ResumeState so it can be imported back into any Resumify
 * instance (or a future version, with migration).
 */

import type { ResumeState } from '@/types'

const EXPORT_VERSION = 1

interface ResumeExportEnvelope {
  _rf: true
  version: number
  exportedAt: string
  data: ResumeState
}

// ─── Export ───────────────────────────────────────────────────

/**
 * Triggers a browser download of the resume as a .json file.
 */
export function downloadResumeJson(state: ResumeState): void {
  const envelope: ResumeExportEnvelope = {
    _rf: true,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  }

  const blob = new Blob([JSON.stringify(envelope, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.filename || 'resume'}-backup.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Import ───────────────────────────────────────────────────

export class ResumeImportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResumeImportError'
  }
}

/**
 * Parses a JSON file and returns the embedded ResumeState.
 * Throws ResumeImportError on invalid format.
 */
export async function parseResumeJson(file: File): Promise<ResumeState> {
  if (!file.name.endsWith('.json')) {
    throw new ResumeImportError('File must be a .json file')
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new ResumeImportError('File too large (max 5 MB)')
  }

  const text = await file.text()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new ResumeImportError('Invalid JSON file')
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('_rf' in parsed) ||
    !('data' in parsed)
  ) {
    throw new ResumeImportError(
      'This file was not exported from Resumify. Only Resumify backup files (.json) can be imported.',
    )
  }

  const envelope = parsed as ResumeExportEnvelope

  if (envelope.version > EXPORT_VERSION) {
    throw new ResumeImportError(
      `This backup was created with a newer version of Resumify (v${envelope.version}). Please update the app.`,
    )
  }

  const state = envelope.data
  if (!state?.personal || !Array.isArray(state?.skills)) {
    throw new ResumeImportError('Backup file is corrupted or incomplete.')
  }

  return state
}

