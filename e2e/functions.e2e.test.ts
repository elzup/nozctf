import { createHash } from 'node:crypto'
import { RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, getDoc, writeBatch } from 'firebase/firestore'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Client, createClient, createTestEnv } from './helpers'

// Values of functions/.env.demo-nozctf
const Q9_PIN = '4271'
const FLAGS = { q9: 'FLAG_e2eq9' } as const

const Q1_FLAG = 'FLAG_e2eanswer'
// Same as ANSWER_RATE.limit in functions/src/ratelimit.ts
const ANSWER_LIMIT = 20
// A matching digit costs 300ms on the server. Half of it still separates it from jitter
const DIGIT_DELAY_THRESHOLD_MS = 150

let env: RulesTestEnvironment
let guest: Client
let clientSeq = 0

const newClient = () => createClient(`client-${++clientSeq}`)

async function newRegisteredClient() {
  const client = await newClient()
  const id = `user${clientSeq}`
  const batch = writeBatch(client.db)

  batch.set(doc(client.db, 'user', client.uid), { id })
  batch.set(doc(client.db, 'userid', id), { uid: client.uid })
  await batch.commit()
  return client
}

async function elapsedMs(run: () => Promise<unknown>) {
  const start = Date.now()

  await run()
  return Date.now() - start
}

beforeAll(async () => {
  env = await createTestEnv()
  guest = await createClient('guest', false)
})

beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled((ctx) =>
    ctx
      .firestore()
      .doc('ans/1')
      .set({ flagHash: createHash('md5').update(Q1_FLAG).digest('hex') })
  )
})

afterAll(async () => {
  await guest.close()
  await env.cleanup()
})

describe('answer', () => {
  it('rejects guests', async () => {
    expect(await guest.call('answer', { q: 1, flag: Q1_FLAG })).toEqual({
      ok: false,
    })
  })

  it('rejects users who have not registered an ID', async () => {
    const client = await newClient()

    expect((await client.call('answer', { q: 1, flag: Q1_FLAG })).ok).toBe(
      false
    )
  })

  it('records the first solve only', async () => {
    const client = await newRegisteredClient()
    const solveRef = doc(client.db, 'solve', client.uid)

    expect((await client.call('answer', { q: 1, flag: 'FLAG_wrong' })).ok).toBe(
      false
    )
    expect((await getDoc(solveRef)).exists()).toBe(false)

    expect((await client.call('answer', { q: 1, flag: Q1_FLAG })).ok).toBe(true)
    const first = (await getDoc(solveRef)).data()

    expect(Object.keys(first ?? {})).toEqual(['1'])

    expect((await client.call('answer', { q: 1, flag: Q1_FLAG })).ok).toBe(true)
    expect((await getDoc(solveRef)).data()).toEqual(first)
  })

  it.each([
    [{ q: 0, flag: Q1_FLAG }],
    [{ q: 10, flag: Q1_FLAG }],
    [{ q: 1.5, flag: Q1_FLAG }],
    [{ q: '1', flag: Q1_FLAG }],
    [{ q: 1 }],
    [{ q: 1, flag: 'F'.repeat(101) }],
    [{ q: 2, flag: Q1_FLAG }],
    [null],
  ])('rejects %j', async (data) => {
    const client = await newRegisteredClient()

    expect((await client.call('answer', data)).ok).toBe(false)
  })

  it('rate limits per user', async () => {
    const client = await newRegisteredClient()
    const other = await newRegisteredClient()

    for (let i = 0; i < ANSWER_LIMIT; i++) {
      const res = await client.call('answer', { q: 1, flag: 'FLAG_wrong' })

      expect(res.message).toBeUndefined()
    }
    expect(await client.call('answer', { q: 1, flag: Q1_FLAG })).toEqual({
      ok: false,
      message: 'too many requests',
    })
    expect((await other.call('answer', { q: 1, flag: Q1_FLAG })).ok).toBe(true)
  })
})

// NOTE: this repository is public. Keep the intended solutions out of the tests.
describe('tryq4 / tryq6 / tryq8', () => {
  it('does not leak a flag for ordinary input', async () => {
    expect(await guest.call('tryq4', { searchId: 'ben' })).toEqual({
      ok: false,
      message: 'User not found',
    })
    expect((await guest.call('tryq6', { word: 'abcdef' })).message).toBe(
      'invalid'
    )
    expect((await guest.call('tryq8', { n: 1.5 })).message).toBe('non integer')
    expect((await guest.call('tryq8', { n: -1.5 })).message).toBe(
      'invalid: negative'
    )
    expect((await guest.call('tryq8', { n: 1 })).message).toBe(
      'invalid: integer'
    )
  })

  it.each([
    ['tryq4', { searchId: 1 }],
    ['tryq4', { searchId: 'a'.repeat(101) }],
    ['tryq4', null],
    ['tryq6', { word: ['a'] }],
    ['tryq6', null],
    ['tryq8', { n: '1' }],
    ['tryq8', null],
  ])(
    '%s answers "invalid input" to %j instead of crashing',
    async (fn, data) => {
      expect(await guest.call(fn, data)).toEqual({
        ok: false,
        message: 'invalid input',
      })
    }
  )
})

describe('tryq9', () => {
  it('rejects guests', async () => {
    expect((await guest.call('tryq9', { pin: Q9_PIN })).message).toBe(
      'unauthorized'
    )
  })

  it.each([[{ pin: 1234 }], [{ pin: '1'.repeat(11) }], [null]])(
    'rejects %j',
    async (data) => {
      const client = await newClient()

      expect((await client.call('tryq9', data)).message).toBe('invalid input')
    }
  )

  it('returns the flag only for the exact pin', async () => {
    const client = await newClient()

    expect((await client.call('tryq9', { pin: '0000' })).message).toBe(
      'wrong pin'
    )
    expect(
      (await client.call('tryq9', { pin: Q9_PIN.slice(0, 3) })).message
    ).toBe('wrong pin')
    expect(await client.call('tryq9', { pin: Q9_PIN })).toEqual({
      ok: true,
      message: `Correct! ${FLAGS.q9}`,
    })
  })

  it('stays solvable: every matching digit makes the response slower', async () => {
    const client = await newClient()

    // Warm up so the cold start is not measured
    await client.call('tryq9', { pin: '0000' })

    const noMatch = await elapsedMs(() => client.call('tryq9', { pin: '0000' }))
    const oneMatch = await elapsedMs(() =>
      client.call('tryq9', { pin: `${Q9_PIN[0]}000` })
    )
    const twoMatch = await elapsedMs(() =>
      client.call('tryq9', { pin: `${Q9_PIN.slice(0, 2)}00` })
    )

    expect(oneMatch - noMatch).toBeGreaterThan(DIGIT_DELAY_THRESHOLD_MS)
    expect(twoMatch - oneMatch).toBeGreaterThan(DIGIT_DELAY_THRESHOLD_MS)
  })
})
