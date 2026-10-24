export type RateWindow = {
  limit: number
  windowMs: number
}

export type RateLimitRule = {
  scope: string
  // A request must fit every window. The short one stops bursts, the long one
  // caps the total so a slow script running for hours still cannot enumerate.
  windows: RateWindow[]
}

const MINUTE_MS = 60 * 1000
const DAY_MS = 24 * 60 * MINUTE_MS

// Flags are too long to brute force, but bursts beyond manual typing only burn Firestore reads
export const ANSWER_RATE: RateLimitRule = {
  scope: 'answer',
  windows: [
    { limit: 20, windowMs: MINUTE_MS },
    { limit: 300, windowMs: DAY_MS },
  ],
}

// Q4/6/8 are solved by reasoning, not by volume; this only stops scripted hammering
export const TRY_RATE: RateLimitRule = {
  scope: 'try',
  windows: [
    { limit: 30, windowMs: MINUTE_MS },
    { limit: 300, windowMs: DAY_MS },
  ],
}

// The per-digit approach to the 4-digit PIN needs about 10 tries per digit (~40 in total).
// The minute window alone allowed all 10^4 PINs in ~3.3 hours; the daily cap makes that ~33 days.
export const Q9_RATE: RateLimitRule = {
  scope: 'q9',
  windows: [
    { limit: 50, windowMs: MINUTE_MS },
    { limit: 300, windowMs: DAY_MS },
  ],
}

/** Returns the timestamps to store when the request is allowed, `null` when it is rate limited. */
export function nextTimestamps(
  timestamps: number[],
  now: number,
  { windows }: RateLimitRule
): number[] | null {
  const longestMs = Math.max(...windows.map((w) => w.windowMs))
  const recent = timestamps.filter((t) => t > now - longestMs)
  const isLimited = windows.some(
    ({ limit, windowMs }) =>
      recent.filter((t) => t > now - windowMs).length >= limit
  )

  if (isLimited) return null
  return [...recent, now]
}
