import axios from 'axios'
import config from '../config'

const client = axios.create({
  baseURL: 'https://asia-northeast1-scoreform.cloudfunctions.net',
})

config.env === 'production'

export function solve(qid: number, flag: string) {
  return client.post('/answer', { q: qid, flag })
}
