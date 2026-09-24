import { Typography, Container } from '@material-ui/core'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import {
  getFirestore,
  registerUser,
  usableUserId,
} from '../../service/firebase'
import App from '../App'
import { useAuth } from '../hooks/useAuth'
import RegisterUserForm from './RegisterUserForm'

function RegisterMain({ uid }: { uid: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const db = getFirestore()

    getDoc(doc(db, 'user', uid))
      .then((snap) => setIsRegistered(snap.exists()))
      .catch((e) => console.error('failed to load user', e))
      .finally(() => setIsLoading(false))
  }, [uid])

  useEffect(() => {
    if (isRegistered) Router.push('/')
  }, [isRegistered])

  if (isLoading) return <Typography>loading</Typography>
  if (isRegistered) return null
  return (
    <div>
      <RegisterUserForm
        onSubmit={async (fields, setErrors) => {
          try {
            const usable = await usableUserId(fields.username)

            if (!usable) {
              setErrors({ username: 'This ID is already taken.' })
              return
            }
            await registerUser(uid, fields.username)
          } catch (e) {
            console.error('failed to register', e)
            setErrors({ username: 'Failed to register. Try again.' })
            return
          }
          alert('Successfully Registered')
          Router.push('/')
        }}
      />
    </div>
  )
}

function RegisterRedirect() {
  const { login } = useAuth()
  const isRegisterable = login.status === 'loading' || login.status === 'auth'

  useEffect(() => {
    if (!isRegisterable) Router.push('/')
  }, [isRegisterable])

  if (login.status !== 'auth') {
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
