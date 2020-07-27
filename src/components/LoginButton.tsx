import { Button } from '@material-ui/core'
import { useAuth } from './hooks/useAuth'

function LoginButton() {
  const { login, signin, signout } = useAuth()

  if (login.status === 'none') {
    return (
      <Button color="inherit" onClick={() => signin()}>
        Sign in with Google
      </Button>
    )
  }
  return (
    <Button color="inherit" onClick={() => signout()}>
      Sign out
    </Button>
  )
}

export default LoginButton
