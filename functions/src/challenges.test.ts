import { describe, expect, it, vi } from 'vitest'
import {
  checkPin,
  eight,
  existsUser,
  Q9_DELAY_PER_DIGIT_MS,
  six,
} from './challenges'

// NOTE: this repository is public. Keep the intended solutions out of the tests,
// only pin down that ordinary inputs never leak a flag.
const FLAG = 'FLAG_test'

describe('existsUser (Q4)', () => {
  it.each(['popout', 'molis', 'ben', 'nobody', '', 'toolongid'])(
    'does not find %s',
    (id) => {
      expect(existsUser(id)).toBeFalsy()
    }
  )
})

describe('six (Q6)', () => {
  it.each([
    ['', 'invalid'],
    ['abcdef', 'invalid'],
    ['QQQQQQ', 'invalid'],
    ['abcdefQ', 'invalid: too long'],
  ])('%s -> %s', (word, expected) => {
    expect(six(word, FLAG)).toBe(expected)
  })
})

describe('eight (Q8)', () => {
  it.each([1.5, 0.5, 100.25, 0.000001])('%s -> non integer', (n) => {
    expect(eight(n, FLAG)).toBe('non integer')
  })

  it.each([0, 1, 2 ** 53, 1e21])('%s -> invalid: integer', (n) => {
    expect(eight(n, FLAG)).toBe('invalid: integer')
  })

  it.each([-1, -1.5, -0.5, -100.25, -1e-7])('%s -> invalid: negative', (n) => {
    expect(eight(n, FLAG)).toBe('invalid: negative')
  })
})

describe('checkPin (Q9)', () => {
  const secret = '4271'

  it('accepts only the exact pin', async () => {
    const sleep = vi.fn(async () => undefined)

    expect(await checkPin(secret, secret, sleep)).toBe(true)
    expect(await checkPin('4270', secret, sleep)).toBe(false)
    expect(await checkPin('427', secret, sleep)).toBe(false)
    expect(await checkPin('42710', secret, sleep)).toBe(false)
    expect(await checkPin('', secret, sleep)).toBe(false)
  })

  it('waits once per leading digit that matches', async () => {
    const sleep = vi.fn(async () => undefined)

    await checkPin('0000', secret, sleep)
    expect(sleep).toHaveBeenCalledTimes(0)

    await checkPin('4200', secret, sleep)
    expect(sleep).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledWith(Q9_DELAY_PER_DIGIT_MS)
  })
})
