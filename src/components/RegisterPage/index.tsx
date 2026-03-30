import { Typography, Container } from '@material-ui/core'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getFirestore, usableUserId } from '../../service/firebase'
import { User } from '../../types'
import App from '../App'
import { useAuth } from '../hooks/useAuth'
import RegisterUserForm from './RegisterUserForm'

function RegisterMain({ uid }: { uid: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const db = getFirestore()

    getDoc(doc(db, 'user', uid)).then((snap) => {
      setIsRegistered(snap.exists())
      setIsLoading(false)
    })
  }, [uid])

  if (isLoading) return <Typography>loading</Typography>
  if (isRegistered) {
    Router.push('/')
    return null
  }
  return (
    <div>
      <RegisterUserForm
        onSubmit={async (fields, setErorrs) => {
          const usable = await usableUserId(fields.username)

          if (!usable) {
            setErorrs({ username: 'This ID is already taken.' })
            return
          }
          const db = getFirestore()

          await setDoc(doc(db, 'user', uid), {
            id: fields.username,
          })
          alert('Successfully Registered')
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
    Router.push('/')
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
