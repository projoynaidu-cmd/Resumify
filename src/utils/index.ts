/**
 * Core utility functions used throughout the application.
 *
 * Domain-specific utilities (ATS, PDF, image compression, etc.)
 * live in src/lib/ — import them from there directly.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Class merging ────────────────────────────────────────────

/**
 * Merges Tailwind classes, resolving conflicts with tailwind-merge
 * and supporting conditional classes via clsx.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── ID generation ────────────────────────────────────────────

/**
 * Generates a collision-resistant local ID suitable for list keys
 * and form entry IDs. Not cryptographically secure.
 *
 * @param prefix - Optional string prefix (e.g. 'exp', 'edu')
 * @returns e.g. "exp-1748123456789-a3f2k"
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Generates a short random slug for public resume sharing URLs.
 * e.g. "x7k2m9"
 */
export function generateSlug(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ─── Promise helpers ──────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── String helpers ───────────────────────────────────────────

/**
 * Capitalises the first character of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncates a string to `maxLength` characters, appending `…` if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

// ─── Object helpers ───────────────────────────────────────────

/**
 * Type-safe Object.entries.
 */
export function typedEntries<T extends Record<string, unknown>>(
  obj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

// ─── Array helpers ────────────────────────────────────────────

/**
 * Moves an item in an array from `from` to `to` index (immutable).
 */
export function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}
