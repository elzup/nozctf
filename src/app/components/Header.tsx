import Link from 'next/link'
import { useContext } from 'react'
import { Typography } from '@material-ui/core'
import LoginButton from './LoginButton'
import { LoginContext } from './App'

export default ({ pathname }: { pathname?: unknown }) => {
  const [login] = useContext(LoginContext)

  return (
    <header>
      Score Form
      {login.status === 'comp' && <Typography>{login.user.id}</Typography>}
      <LoginButton />
    </header>
  )
}
