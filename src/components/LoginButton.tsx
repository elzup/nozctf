import { Button } from '@material-ui/core'
import { signin } from '../service/firebase'
import { ProviderType } from '../types'
import { useAuth } from './hooks/useAuth'

// Closing the popup rejects the promise; that is a normal user action, not something to alert about
const signinQuietly = (type: ProviderType) =>
  signin(type).catch((e) => console.error('sign in failed', e))

function LoginButton() {
  const { login, signout } = useAuth()

  if (login.status === 'none') {
    return (
      <div>
        <Button color="inherit" onClick={() => signinQuietly('google')}>
          Google
        </Button>
        <Button color="inherit" onClick={() => signinQuietly('twitter')}>
          Twitter
        </Button>
      </div>
    )
  }
  return (
    <Button color="inherit" onClick={() => signout()}>
      Sign out
    </Button>
  )
}

export default LoginButton
