import { Button } from '@material-ui/core'
import { useAuth } from './hooks/useAuth'

function LoginButton() {
  const { login, signin, signout } = useAuth()

  if (login.status === 'none') {
    return <Button onClick={() => signin()}>Google ログイン</Button>
  }
  return <Button onClick={() => signout()}>ログアウト</Button>
}

export default LoginButton
