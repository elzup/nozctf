import Link from 'next/link'
import LoginButton from './LoginButton'

export default ({ pathname }: { pathname?: unknown }) => (
  <header>
    <Link href="/">
      <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
    </Link>
    <Link href="/about">
      <a className={pathname === '/about' ? 'is-active' : ''}>About</a>
    </Link>
    <LoginButton />
  </header>
)
