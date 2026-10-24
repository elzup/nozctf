import { describe, expect, it } from 'vitest'
import { nextTimestamps, Q9_RATE, RateLimitRule } from './ratelimit'

const rule: RateLimitRule = {
  scope: 'test',
  windows: [
    { limit: 3, windowMs: 1000 },
    { limit: 5, windowMs: 10_000 },
  ],
}
const now = 100_000

describe('nextTimestamps', () => {
  it('records the first request', () => {
    expect(nextTimestamps([], now, rule)).toEqual([now])
  })

  it('allows requests below the limit', () => {
    expect(nextTimestamps([99_500, 99_800], now, rule)).toEqual([
      99_500,
      99_800,
      now,
    ])
  })

  it('blocks the request that exceeds the short window', () => {
    expect(nextTimestamps([99_200, 99_500, 99_800], now, rule)).toBeNull()
  })

  it('blocks the request that exceeds the long window even when spread out', () => {
    expect(
      nextTimestamps([91_000, 93_000, 95_000, 97_000, 99_000], now, rule)
    ).toBeNull()
  })

  it('forgets requests older than the longest window', () => {
    expect(nextTimestamps([80_000, 91_000, 99_500], now, rule)).toEqual([
      91_000,
      99_500,
      now,
    ])
  })

  it('does not mutate the stored timestamps', () => {
    const stored = [99_500]

    nextTimestamps(stored, now, rule)
    expect(stored).toEqual([99_500])
  })
})

describe('Q9_RATE', () => {
  const PIN_SPACE = 10 ** 4
  const DAY_MS = 24 * 60 * 60 * 1000

  it('makes enumerating every 4-digit PIN take more than a week per account', () => {
    const daily = Math.min(
      ...Q9_RATE.windows.map((w) => w.limit * (DAY_MS / w.windowMs))
    )

    expect(PIN_SPACE / daily).toBeGreaterThan(7)
  })
})
