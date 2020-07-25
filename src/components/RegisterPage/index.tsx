import { Typography } from '@material-ui/core'
import Router from 'next/router'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { getFirestore, usableUserId } from '../../service/firebase'
import { User } from '../../types'
import App from '../App'
import { useAuth } from '../hooks/useAuth'
import RegisterUserForm from './RegisterUserForm'

const fdb = getFirestore()

function RegisterMain({ uid }: { uid: string }) {
  const [doc, loading] = useDocumentDataOnce<User | undefined>(
    fdb.collection('user').doc(uid)
  )

  if (loading) return <Typography>loading</Typography>
  if (!!doc) {
    Router.push('/') // NOTE: alraedy registered
    return null
  }
  return (
    <div>
      <RegisterUserForm
        onSubmit={async (fields, setErorrs) => {
          const usable = await usableUserId(fields.username)

          if (!usable) {
            setErorrs({ username: 'すでに使われているIDです' })
            return
          }
          await fdb.collection('user').doc(uid).set({
            id: fields.username,
          })
          alert('登録しました')
          Router.push('/')
        }}
      />
    </div>
  )
}

function RegisterRedirect() {
  const { login } = useAuth()

  if (login.status !== 'auth') {
    Router.push('/') // NOTE: not login
    return null
  }
  return <RegisterMain uid={login.uid} />
}

function RegisterPage() {
  return (
    <App>
      <Typography variant="h4">ユーザ登録</Typography>
      <RegisterRedirect />
    </App>
  )
}

export default RegisterPage
