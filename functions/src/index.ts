import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

type SolveQuery = {
  q: number
  flag: string
}

type Answer = {
  flag: string
}

export const answer = functions
  .region('asia-northeast1')
  .https.onCall(async (data: SolveQuery, context) => {
    if (!context.auth) {
      return { ok: false }
    }
    return { ok: await solveQuery(data, context.auth.uid) }
  })

async function solveQuery(body: SolveQuery, uid: string) {
  const user = await admin.firestore().collection('user').doc(uid).get()

  const doc = await admin
    .firestore()
    .collection('ans')
    .doc(String(body.q))
    .get()
  const ans = doc.data() as Answer

  if (ans.flag !== body.flag) return false
  const solveDoc = await admin
    .firestore()
    .collection('solve')
    .doc(user.id)
    .get()

  const solves = solveDoc.data()

  if (solves && !!solves[body.q]) {
    return true
  }

  await solveDoc.ref.update({ [body.q]: new Date() })

  return true
}
