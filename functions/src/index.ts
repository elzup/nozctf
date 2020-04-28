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
  .https.onRequest(async (req, res) => {
    const allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8000']
    const origin = req.headers.origin

    if (typeof origin === 'string' && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.set('Access-Control-Allow-Methods', 'OPTIONS, POST')
    const token = req.headers.authorization?.split('Bearer ')[1]

    if (!token) {
      res.send({ ok: false })
      return
    }
    res.send({ ok: await solveQuery(req.body as SolveQuery, token) })
  })

async function solveQuery(body: SolveQuery, token: string) {
  const decodedToken = await admin.auth().verifyIdToken(token)
  const user = await admin
    .firestore()
    .collection('user')
    .doc(decodedToken.uid)
    .get()

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
