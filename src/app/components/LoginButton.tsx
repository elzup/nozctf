import { Button, Typography } from '@material-ui/core'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from '../service/firebase'

const { auth, login, logout } = getAuth()

function LoginButton() {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return <Typography>loading</Typography>
  }

  return (
    <header>
      {user && <Button onClick={() => logout()}>ログアウト</Button>}
      {!user && <Button onClick={() => login()}>Google ログイン</Button>}
    </header>
  )
}

export default LoginButton
