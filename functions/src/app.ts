import express, { NextFunction, Request, Response, json } from 'express'

const app = express()
// eslint-disable-next-line new-cap
const router = express.Router()

app.use(json)
app.use('/', router)

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path)
  next()
})

export { app }
