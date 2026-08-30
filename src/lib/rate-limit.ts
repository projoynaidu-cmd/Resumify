import { LRUCache } from 'lru-cache'

interface Options {
  max: number
  ttlMs: number
  size?: number
}

interface Record {
  count: number
  reset: number
}

class RateLimiter {
  private cache: LRUCache<string, Record>
  readonly max: number
  readonly ttlMs: number

  constructor({ max, ttlMs, size }: Options) {
    this.max = max
    this.ttlMs = ttlMs
    this.cache = new LRUCache({
      max: size ?? max * 2,
      ttl: ttlMs,
    })
  }

  check(identifier: string): { allowed: boolean; remaining: number; reset: number } {
    const now = Date.now()
    const record = this.cache.get(identifier)

    if (!record) {
      this.cache.set(identifier, { count: 1, reset: now + this.ttlMs })
      return { allowed: true, remaining: this.max - 1, reset: now + this.ttlMs }
    }

    if (record.count >= this.max) {
      return { allowed: false, remaining: 0, reset: record.reset }
    }

    record.count += 1
    this.cache.set(identifier, record)
    return { allowed: true, remaining: this.max - record.count, reset: record.reset }
  }

  reset(identifier: string): void {
    this.cache.delete(identifier)
  }
}

export const authRateLimiter = new RateLimiter({
  max: 5,
  ttlMs: 15 * 60 * 1000,
})

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  const xreal = req.headers.get('x-real-ip')
  if (xff) return xff.split(',')[0].trim()
  if (xreal) return xreal.trim()
  return 'unknown'
}
