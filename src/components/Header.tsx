import { Typography } from '@material-ui/core'
import LoginButton from './LoginButton'
import { useAuth } from './hooks/useAuth'

function Header() {
  const { login } = useAuth()

  return (
    <header>
      Score Form
      {login.status === 'comp' && <Typography>{login.user.id}</Typography>}
      <LoginButton />
    </header>
  )
}
export default Header
