import express, { json } from 'express'

const app = express()
// eslint-disable-next-line new-cap
const router = express.Router()

app.use(json)
app.use('/', router)

export { app }
