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
