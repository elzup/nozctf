import * as crypto from 'crypto'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import 'firebase-functions/logger/compat'
import { defineString } from 'firebase-functions/params'
import { checkPin, eight, existsUser, six } from './challenges'
import {
  ANSWER_RATE,
  nextTimestamps,
  Q9_RATE,
  RateLimitRule,
} from './ratelimit'
import {
  isShortString,
  isValidQuestionNum,
  MAX_FLAG_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_PIN_LENGTH,
} from './validate'

admin.initializeApp()

const KEY_Q4 = defineString('KEY_Q4')
const KEY_Q6 = defineString('KEY_Q6')
const KEY_Q8 = defineString('KEY_Q8')
const KEY_Q9PIN = defineString('KEY_Q9PIN')
const KEY_Q9 = defineString('KEY_Q9')

type SolveQuery = {
  q: number
  flag: string
}

type Answer = {
  flagHash: string
}

async function checkRateLimit(
  uid: string,
  rule: RateLimitRule
): Promise<boolean> {
  const ref = admin
    .firestore()
    .collection('ratelimit')
    .doc(`${rule.scope}_${uid}`)

  return admin.firestore().runTransaction(async (tx) => {
    const doc = await tx.get(ref)
    const timestamps = nextTimestamps(
      doc.data()?.timestamps ?? [],
      Date.now(),
      rule
    )

    if (timestamps === null) return false

    tx.set(ref, { timestamps })
    return true
  })
}

export const answer = functions.https.onCall(
  async (data: Partial<SolveQuery> | null, context) => {
    if (!context.auth) {
      return { ok: false }
    }
    const q = data?.q
    const flag = data?.flag

    if (!isValidQuestionNum(q) || !isShortString(flag, MAX_FLAG_LENGTH)) {
      return { ok: false }
    }
    if (!(await checkRateLimit(context.auth.uid, ANSWER_RATE))) {
      return { ok: false, message: 'too many requests' }
    }
    return { ok: await solveQuery({ q, flag }, context.auth.uid) }
  }
)

function isSameHash(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)

  // timingSafeEqual throws on different lengths
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)
}

async function solveQuery(body: SolveQuery, uid: string) {
  const db = admin.firestore()
  const user = await db.collection('user').doc(uid).get()

  if (!user.exists) return false

  const doc = await db.collection('ans').doc(String(body.q)).get()

  if (!doc.exists) return false
  const ans = doc.data() as Answer

  const ansHash = crypto.createHash('md5').update(body.flag).digest('hex')

  if (typeof ans.flagHash !== 'string' || !isSameHash(ans.flagHash, ansHash)) {
    return false
  }

  const solveRef = db.collection('solve').doc(uid)

  // Keep the first solved time even when the same flag is submitted concurrently
  await db.runTransaction(async (tx) => {
    const solveDoc = await tx.get(solveRef)

    if (solveDoc.data()?.[body.q]) return
    tx.set(solveRef, { [body.q]: new Date() }, { merge: true })
  })

  return true
}

export const tryq4 = functions.https.onCall(
  async (data: { searchId?: unknown } | null) => {
    const searchId = data?.searchId

    if (!isShortString(searchId, MAX_INPUT_LENGTH)) {
      return { ok: false, message: 'invalid input' }
    }
    if (!existsUser(searchId)) return { ok: false, message: 'User not found' }

    return { ok: true, message: `User found! FLAG_${KEY_Q4.value()}` }
  }
)

export const tryq6 = functions.https.onCall(
  async (data: { word?: unknown } | null) => {
    const word = data?.word

    if (!isShortString(word, MAX_INPUT_LENGTH)) {
      return { ok: false, message: 'invalid input' }
    }
    return { ok: true, message: six(word, `FLAG_${KEY_Q6.value()}`) }
  }
)

export const tryq8 = functions.https.onCall(
  async (data: { n?: unknown } | null) => {
    const n = data?.n

    if (typeof n !== 'number' || !isFinite(n)) {
      return { ok: false, message: 'invalid input' }
    }
    return { ok: true, message: eight(n, `FLAG_${KEY_Q8.value()}`) }
  }
)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const tryq9 = functions.https.onCall(
  async (data: { pin?: unknown } | null, context) => {
    if (!context.auth) {
      return { ok: false, message: 'unauthorized' }
    }
    const pin = data?.pin

    if (!isShortString(pin, MAX_PIN_LENGTH)) {
      return { ok: false, message: 'invalid input' }
    }
    if (!(await checkRateLimit(context.auth.uid, Q9_RATE))) {
      return { ok: false, message: 'too many requests' }
    }
    if (!(await checkPin(pin, KEY_Q9PIN.value(), sleep))) {
      return { ok: false, message: 'wrong pin' }
    }

    return { ok: true, message: `Correct! FLAG_${KEY_Q9.value()}` }
  }
)
