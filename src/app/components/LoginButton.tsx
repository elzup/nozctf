import { Button } from '@material-ui/core'
import { useAuthState } from 'react-firebase-hooks/auth'
import Router from 'next/router'
import { getAuth } from '../service/firebase'

const { auth, login, logout } = getAuth()

// @ts-ignore
window.React1 = require('react')

// Add this in your component file
// @ts-ignore
require('react-dom')
// @ts-ignore
window.React2 = require('react')

// @ts-ignore
console.log(window.React1 === window.React2)

function LoginButton() {
  const [user, loading] = useAuthState(auth)

  if (!loading) {
    return
  }

  return (
    <header>
      {user && <Button onClick={() => logout()}>ログアウト</Button>}
      {!user && <Button onClick={() => login()}>Google ログイン</Button>}
    </header>
  )
}

export default LoginButton
