import express, { NextFunction, Request, Response } from 'express'
import * as functions from 'firebase-functions'
import fetch from 'node-fetch'

import WorkerPool from 'workerpool'

const app = express()
// eslint-disable-next-line new-cap
const router = express.Router()

app.use(express.json())
app.use('/', router)

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path)
  next()
})

const LOREM = `Lorem ipsum dolor sit amet comsectetur adipiscing elit`

const FLAG_Q7 = `FLAG_${functions.config().key.e7}`

router.post('/tryq7_b', (req, res, next) => {
  const m = new RegExp(req.body.word).exec(LOREM)

  return m ? 'Hit! ' + m[0] : 'no hit'

  next()
})

router.post('/tryq7', (req, res, next) => {
  const { searchWord } = req.body.data

  if (searchWord.length > 12) {
    res.json({ ok: false, message: 'Too long' })
    next()
  }

  req.setTimeout(1, () => {
    const message = `Timeout! ${FLAG_Q7}`

    console.log('timeout')
    res.json({ ok: true, message })
    next()
  })

  const m = new RegExp(searchWord).exec(LOREM)
  const message = m ? 'Hit! ' + m[0] : 'no hit'

  res.json({ ok: true, message })
})

export { app }
