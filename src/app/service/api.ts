import axios from 'axios'
import config from '../config'

const client = axios.create({
  baseURL: 'scoreform.web.app',
})

config.env === 'production'

export function solve(qid: number, flag: string) {
  return client.post('/solve', { q: qid, flag })
}
