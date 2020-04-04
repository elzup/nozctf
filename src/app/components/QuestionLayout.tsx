import { useState } from 'react'
import { Button, Input, Typography } from '@material-ui/core'
import * as firebase from 'firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

import { getFirestore } from '../service/firebase'
import { Question } from '../types'
import App from './App'

const fdb = getFirestore()

type Props = {
  q: Question
}
const QuestionLayout: React.FC<Props> = ({ children }) => {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [text, setText] = useState<string>('')

  return (
    <App>
      <div></div>
      {children}
    </App>
  )
}

export default QuestionLayout
