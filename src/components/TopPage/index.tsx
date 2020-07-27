import { Container, Paper, Typography } from '@material-ui/core'
import Link from 'next/link'
import Router from 'next/router'
import { questions } from '../../questions'
import { useSolve } from '../../service/firebase'
import App from '../App'
import { useAuth } from '../hooks/useAuth'

function ListWithLogin({ uid }: { uid: string }) {
  const { solve } = useSolve(uid)

  return (
    <ul>
      {questions.map((q) => (
        <li key={q.num}>
          {solve[q.num] ? 'solved!' : ''}
          <Link href={`/q/${q.num}`}>
            <a>{q.text}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function List() {
  return (
    <ul>
      {questions.map((q) => (
        <li key={q.num}>
          <Link href={`/q/${q.num}`}>
            <a>{q.text}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function TopPage() {
  const { login } = useAuth()

  if (login.status === 'loading') {
    return null
  }
  if (login.status === 'auth') {
    Router.push('/register') // NOTE: not login
    return null
  }
  if (login.status === 'comp') {
    return <ListWithLogin uid={login.uid} />
  }
  return <List />
}

function TopPageContainer() {
  return (
    <App>
      <Container fixed maxWidth="md">
        <Paper elevation={0} style={{ marginTop: '1rem' }}>
          <Typography variant="h3">nozctf</Typography>
          <Typography>
            I will give you a question about IT. Look for flags in the
            `FLAG_abcABC123`.
            <br />
            Do not attack this Website.
          </Typography>
        </Paper>
        <TopPage />
      </Container>
    </App>
  )
}

export default TopPageContainer
