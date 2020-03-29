import { useState } from 'react'
import { Button, Input, Typography } from '@material-ui/core'
import * as firebase from 'firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

import { getFirestore } from '../../service/firebase'
import App from '../App'

const fdb = getFirestore()

function TopPage() {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [text, setText] = useState<string>('')

  return (
    <App>
      <div>ge0j pa</div>
    </App>
  )
}
export default TopPage
