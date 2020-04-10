import path from 'path'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'

const app = next({
  dev,
  conf: {
    distDir: `${path.relative(process.cwd(), __dirname)}/../functions/next`,
  },
})
const handle = app.getRequestHandler()

export const nextApp = functions.https.onRequest((req, res) => {
  console.log('File: ' + req.originalUrl)
  if (req.path === '/solve') {
    res.send({ ok: solve(req) })
    return
  }
  return app.prepare().then(() => handle(req, res))
})

type SolveQuery = {
  q: number
  flag: string
}

type Answer = {
  flag: string
}

async function solve(req: functions.https.Request) {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (!token) {
    return false
  }
  const decodedToken = await admin.auth().verifyIdToken(token)
  const user = await admin
    .firestore()
    .collection('user')
    .doc(decodedToken.uid)
    .get()

  const body = req.body as SolveQuery

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

  solveDoc.ref.update({ [body.q]: new Date() })

  return true
}
