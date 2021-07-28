import express, { NextFunction, Request, Response } from 'express'

const app = express()
// eslint-disable-next-line new-cap
const router = express.Router()

app.use(express.json())
app.use('/', router)

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path)
  next()
})

export { app }
