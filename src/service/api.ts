import axios from 'axios'
import firebase from 'firebase'

const client = axios.create({
  baseURL: 'https://nozctf.web.app',
})

export async function solve(qid: number, flag: string) {
  return client.post<{ result: { ok: boolean } }>(
    '/answer',
    { data: { q: qid, flag } },
    await authOptions()
  )
}

export async function tryq4(searchId: string) {
  return client.post<{ result: { ok: boolean; message: string } }>('/tryq4', {
    data: { searchId },
  })
}

export async function tryq7(searchWord: string) {
  return client.post<{ result: { ok: boolean; message: string } }>('/tryq7', {
    data: { searchWord },
  })
}

export async function authOptions() {
  const user = firebase.auth().currentUser

  if (!user) throw new Error('not login user')
  const token = await user.getIdToken()

  return { headers: { authorization: `Bearer ${token}` } }
}
