import Link from 'next/link'
import LoginButton from './LoginButton'

export default ({ pathname }: { pathname?: unknown }) => (
  <header>
    Score Form
    <LoginButton />
  </header>
)
