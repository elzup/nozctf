import { Typography, Container } from '@material-ui/core'
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
            setErorrs({ username: 'This ID is already token.' })
            return
          }
          await fdb.collection('user').doc(uid).set({
            id: fields.username,
          })
          alert('Uuccessfully Registered')
          Router.push('/')
        }}
      />
    </div>
  )
}

function RegisterRedirect() {
  const { login } = useAuth()

  if (login.status === 'loading') {
    return null
  }
  if (login.status !== 'auth') {
    Router.push('/') // NOTE: not login
    return null
  }
  return <RegisterMain uid={login.uid} />
}

function RegisterPage() {
  return (
    <App>
      <Container>
        <Typography variant="h4">User registration</Typography>
        <RegisterRedirect />
      </Container>
    </App>
  )
}

export default RegisterPage
