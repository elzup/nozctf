import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'

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

type MessageReesponse = { result: { ok: boolean; message: string } }
export const tryq4 = (searchId: string) =>
  client.post<MessageReesponse>('/tryq4', { data: { searchId } })

export const tryq6 = (word: string) =>
  client.post<MessageReesponse>('/tryq6', { data: { word } })

export const tryq7 = (searchWord: string) =>
  client.post<string>('/tryq7', searchWord)

export async function authOptions() {
  const user = firebase.auth().currentUser

  if (!user) throw new Error('not login user')
  const token = await user.getIdToken()

  return { headers: { authorization: `Bearer ${token}` } }
}
