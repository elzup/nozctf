import Link from 'next/link'
import { Container } from '@material-ui/core'
import { questions } from '../../questions'
import { User } from '../../types'
import App from '../App'
import { useAuth } from '../hooks/useAuth'

function ListWithLogin({ user }: { user: User }) {
  console.log(user)

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

  if (login.status === 'comp') {
    return <ListWithLogin user={login.user} />
  }
  return <List />
}

function TopPageContainer() {
  return (
    <App>
      <Container>
        <TopPage />
      </Container>
    </App>
  )
}

export default TopPageContainer
