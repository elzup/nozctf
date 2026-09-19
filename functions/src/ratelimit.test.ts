import { describe, expect, it } from 'vitest'
import { nextTimestamps, RateLimitRule } from './ratelimit'

const rule: RateLimitRule = { scope: 'test', limit: 3, windowMs: 1000 }
const now = 10_000

describe('nextTimestamps', () => {
  it('records the first request', () => {
    expect(nextTimestamps([], now, rule)).toEqual([now])
  })

  it('allows requests below the limit', () => {
    expect(nextTimestamps([9_500, 9_800], now, rule)).toEqual([
      9_500,
      9_800,
      now,
    ])
  })

  it('blocks the request that exceeds the limit', () => {
    expect(nextTimestamps([9_200, 9_500, 9_800], now, rule)).toBeNull()
  })

  it('forgets requests older than the window', () => {
    expect(nextTimestamps([8_000, 9_000, 9_500, 9_800], now, rule)).toEqual([
      9_500,
      9_800,
      now,
    ])
  })

  it('does not mutate the stored timestamps', () => {
    const stored = [9_500]

    nextTimestamps(stored, now, rule)
    expect(stored).toEqual([9_500])
  })
})
