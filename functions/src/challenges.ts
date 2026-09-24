// NOTE: the functions below are intentionally the same code as shown on the question pages.
// Their weaknesses are the challenges, do not "fix" them.

const users = [
  { id: 'popout', deleted: true },
  { id: 'molis', deleted: true },
  { id: 'ben', deleted: true },
]
const userById: Record<string, (typeof users)[0]> = {}

users.forEach((user) => (userById[user.id] = user))

export function existsUser(searchId: string) {
  if (searchId.length > 8) return false

  const user = userById[searchId]

  return user && !user.deleted
}

export function six(ssssssQ: string, flag: string) {
  if (typeof ssssssQ !== 'string') return 'invalid: no string'
  if ([...ssssssQ].length > 6) return 'invalid: too long'
  if (ssssssQ[6] !== 'Q') return 'invalid'
  return flag
}

// @ts-ignore
const isInteger = (n: number) => n <= parseInt(n)

export function eight(n: number, flag: string) {
  if (typeof n !== 'number') return 'invalid: no number'
  if (n < 0) return 'invalid: negative'
  if (Number.isInteger(n)) return 'invalid: integer'
  if (!isInteger(n)) return 'non integer'
  return flag
}

// Long enough to stand out from network jitter (tens of ms)
export const Q9_DELAY_PER_DIGIT_MS = 300

type Sleep = (ms: number) => Promise<unknown>

export async function checkPin(pin: string, secret: string, sleep: Sleep) {
  for (let i = 0; i < secret.length; i++) {
    if (pin[i] !== secret[i]) return false
    await sleep(Q9_DELAY_PER_DIGIT_MS)
  }

  return pin.length === secret.length
}
