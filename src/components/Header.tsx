import { Typography, AppBar, Toolbar } from '@material-ui/core'
import Link from 'next/link'
import LoginButton from './LoginButton'
import { useAuth } from './hooks/useAuth'

function Header() {
  const { login } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Link href="/">
          <Typography
            className="title"
            variant="h6"
            color="inherit"
            style={{ flex: 1 }}
          >
            Score Form
          </Typography>
        </Link>
        {login.status === 'comp' && <Typography>{login.user.id}</Typography>}
        <LoginButton />
      </Toolbar>
    </AppBar>
  )
}
export default Header
