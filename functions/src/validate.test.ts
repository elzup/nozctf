import { describe, expect, it } from 'vitest'
import { isShortString, isValidQuestionNum, QUESTION_COUNT } from './validate'

describe('isValidQuestionNum', () => {
  it('accepts every question number', () => {
    expect(isValidQuestionNum(1)).toBe(true)
    expect(isValidQuestionNum(QUESTION_COUNT)).toBe(true)
  })

  it.each([
    0,
    QUESTION_COUNT + 1,
    -1,
    1.5,
    NaN,
    Infinity,
    '1',
    null,
    undefined,
    {},
  ])('rejects %s', (q) => {
    expect(isValidQuestionNum(q)).toBe(false)
  })
})

describe('isShortString', () => {
  it('accepts strings up to the max length', () => {
    expect(isShortString('', 3)).toBe(true)
    expect(isShortString('abc', 3)).toBe(true)
  })

  it.each([['abcd'], [1], [null], [undefined], [['a']], [{ length: 1 }]])(
    'rejects %s',
    (value) => {
      expect(isShortString(value, 3)).toBe(false)
    }
  )
})
