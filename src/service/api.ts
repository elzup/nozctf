import axios from 'axios'
import * as firebase from 'firebase/app'
import 'firebase/auth'

const client = axios.create({
  baseURL: 'https://nozctf.web.app',
})

export async function solve(qid: number, flag: string) {
  return client.post<{ ok: boolean }>(
    '/answer',
    { data: { q: qid, flag } },
    await authOptions()
  )
}

export async function tryq4(searchId: string) {
  return client.post<{ ok: boolean; message: string }>(
    '/tryq4',
    { data: { searchId } },
    await authOptions()
  )
}

export async function authOptions() {
  const user = firebase.auth().currentUser

  if (!user) throw new Error('not login user')
  const token = await user.getIdToken()

  return { headers: { authorization: `Bearer ${token}` } }
}
