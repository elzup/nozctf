import { describe, expect, it } from 'vitest'
import { countSolves } from './countSolves'

describe('countSolves', () => {
  it('returns nothing when nobody solved', () => {
    expect(countSolves([])).toEqual({})
    expect(countSolves([{}])).toEqual({})
  })

  it('counts solvers per question', () => {
    const solves = [{ 1: 'a', 2: 'a' }, { 1: 'b' }, { 1: 'c', 9: 'c' }]

    expect(countSolves(solves)).toEqual({
      1: { count: 3 },
      2: { count: 1 },
      9: { count: 1 },
    })
  })
})
