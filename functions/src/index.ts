import * as crypto from 'crypto'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import 'firebase-functions/lib/logger/compat'

admin.initializeApp()

type SolveQuery = {
  q: number
  flag: string
}

type Answer = {
  flagHash: string
}

export const answer = functions.https.onCall(
  async (data: SolveQuery, context) => {
    if (!context.auth) {
      return { ok: false }
    }
    return { ok: await solveQuery(data, context.auth.uid) }
  }
)

async function solveQuery(body: SolveQuery, uid: string) {
  const user = await admin.firestore().collection('user').doc(uid).get()

  const doc = await admin
    .firestore()
    .collection('ans')
    .doc(String(body.q))
    .get()
  const ans = doc.data() as Answer

  const ansHash = crypto.createHash('md5').update(body.flag).digest('hex')

  if (ans.flagHash !== ansHash) return false
  const solveDoc = await admin
    .firestore()
    .collection('solve')
    .doc(user.id)
    .get()

  if (!solveDoc.exists) {
    solveDoc.ref.set({})
  }

  const solves = solveDoc.data()

  if (solves && !!solves[body.q]) {
    return true
  }

  await solveDoc.ref.update({ [body.q]: new Date() })

  return true
}

export const tryq4 = functions.https.onCall(
  async ({ searchId }: { searchId: string }) => {
    const users = [
      { id: 'popout', deleted: true },
      { id: 'molis', deleted: true },
      { id: 'ben', deleted: true },
    ]
    const userById: Record<string, typeof users[0]> = {}

    users.forEach((user) => (userById[user.id] = user))

    const existsUser = (searchId: string) => {
      if (searchId.length > 8) return false

      const user = userById[searchId]

      return user && !user.deleted
    }

    if (!existsUser(searchId)) return { ok: false, message: 'User not found' }

    const message = `User found! FLAG_${functions.config().key.q4}`

    return { ok: true, message }
  }
)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const tryq7 = functions.https.onCall(
  async ({ searchWord }: { searchWord: string }) => {
    if (searchWord.length > 12) return { ok: false, message: 'Too long' }

    const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`.replace(
      /[,.]/g,
      ''
    )

    const search = async (word: string) => {
      const m = new RegExp(word).exec(lorem)

      return m ? m[0] : 'no hit'
    }
    const timeout = async (ms: number) => {
      await sleep(ms)
      const message = `Timeout! FLAG_${functions.config().key.e7}`

      return message
    }

    const res = await Promise.race([search(searchWord), timeout(500)])

    return { ok: true, message: res }
  }
)
