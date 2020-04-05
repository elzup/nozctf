import * as firebase from 'firebase'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { questions } from '../../questions'
import { getFirestore } from '../../service/firebase'
import App from '../App'
import { User } from '../../types'

const fdb = getFirestore()

function ListWithLogin({ uid }: { uid: string }) {
  const [doc, loading] = useDocumentData<User>(fdb.collection('user').doc(uid))

  console.log(doc)

  return (
    <ul>
      {questions.map((q) => (
        <li key={q.num}>
          <Link href={`/q/${q.num}`}>{q.text}</Link>
        </li>
      ))}
    </ul>
  )
}

function List() {
  return (
    <ul>
      {questions.map((q) => (
        <li key={q.num}>
          <Link href={`/q/${q.num}`}>{q.text}</Link>
        </li>
      ))}
    </ul>
  )
}

function TopPage() {
  const [user, loading] = useAuthState(firebase.auth())

  return (
    <App>{!loading && user ? <ListWithLogin uid={user.uid} /> : <List />}</App>
  )
}

export default TopPage
