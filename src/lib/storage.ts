/**
 * Versioned localStorage abstraction.
 *
 * Responsibilities:
 * - Namespace all keys under a single prefix
 * - Detect schema version mismatches and migrate/reset gracefully
 * - Wrap every operation in try/catch (SSR-safe, quota-safe)
 * - Provide typed read/write helpers
 */

const STORAGE_PREFIX = 'resumeforge'
const SCHEMA_VERSION = 2

interface StoredEnvelope<T> {
  v: number
  ts: number
  data: T
}

function key(name: string): string {
  return `${STORAGE_PREFIX}:${name}`
}

/**
 * Write a value with version envelope.
 */
export function storageSet<T>(name: string, value: T): boolean {
  if (typeof window === 'undefined') return false
  try {
    const envelope: StoredEnvelope<T> = {
      v: SCHEMA_VERSION,
      ts: Date.now(),
      data: value,
    }
    localStorage.setItem(key(name), JSON.stringify(envelope))
    return true
  } catch {
    // Quota exceeded or private browsing
    return false
  }
}

/**
 * Read a value, returning null on version mismatch or parse error.
 */
export function storageGet<T>(name: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key(name))
    if (!raw) return null
    const envelope = JSON.parse(raw) as StoredEnvelope<T>
    // Version mismatch — discard stale data
    if (envelope.v !== SCHEMA_VERSION) {
      storageRemove(name)
      return null
    }
    return envelope.data
  } catch {
    storageRemove(name)
    return null
  }
}

/**
 * Remove a stored key.
 */
export function storageRemove(name: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key(name))
  } catch {
    // ignore
  }
}

/**
 * Clear ALL resumeforge keys (used for "reset" functionality).
 */
export function storageClearAll(): void {
  if (typeof window === 'undefined') return
  try {
    const toDelete: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(STORAGE_PREFIX)) toDelete.push(k)
    }
    toDelete.forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}

/**
 * Get approximate storage usage in bytes for our namespace.
 */
export function storageGetUsageBytes(): number {
  if (typeof window === 'undefined') return 0
  try {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(STORAGE_PREFIX)) {
        total += (k.length + (localStorage.getItem(k)?.length ?? 0)) * 2 // UTF-16
      }
    }
    return total
  } catch {
    return 0
  }
}

// Well-known storage keys
export const STORAGE_KEYS = {
  RESUME: 'resume',
  PREFERENCES: 'preferences',
} as const
