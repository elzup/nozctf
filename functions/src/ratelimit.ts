export type RateLimitRule = {
  scope: string
  limit: number
  windowMs: number
}

// Flags are too long to brute force, but bursts beyond manual typing only burn Firestore reads
export const ANSWER_RATE: RateLimitRule = {
  scope: 'answer',
  limit: 20,
  windowMs: 60 * 1000,
}

// Enough for the intended per-digit approach to Q9, too few to enumerate every PIN
export const Q9_RATE: RateLimitRule = {
  scope: 'q9',
  limit: 50,
  windowMs: 60 * 1000,
}

/** Returns the timestamps to store when the request is allowed, `null` when it is rate limited. */
export function nextTimestamps(
  timestamps: number[],
  now: number,
  { limit, windowMs }: RateLimitRule
): number[] | null {
  const recent = timestamps.filter((t) => t > now - windowMs)

  if (recent.length >= limit) return null
  return [...recent, now]
}
