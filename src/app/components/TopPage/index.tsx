import * as firebase from 'firebase'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { questions } from '../../questions'
import { getFirestore } from '../../service/firebase'
import App from '../App'

const fdb = getFirestore()

function TopPage() {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [text, setText] = useState<string>('')

  return (
    <App>
      <ul>
        {questions.map((q) => (
          <li key={q.num}>
            <Link href={`/q/${q.num}`}>{q.text}</Link>
          </li>
        ))}
      </ul>
    </App>
  )
}
export default TopPage
