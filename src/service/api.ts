import axios from 'axios'
import * as firebase from 'firebase/app'
import config from '../config'
import 'firebase/auth'

const client = axios.create({
  baseURL: 'https://asia-northeast1-scoreform.cloudfunctions.net',
})

config.env === 'production'

export async function solve(qid: number, flag: string) {
  const user = firebase.auth().currentUser

  if (!user) throw new Error('not login user')
  const token = await user.getIdToken()

  console.log(`${token}`)

  return client.post(
    '/answer',
    { data: { q: qid, flag } },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  )
}
