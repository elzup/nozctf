import { Container, Typography } from '@material-ui/core'
import Head from 'next/head'
import Router from 'next/router'
import { solve } from '../service/api'
import { Question } from '../types'
import AnswerForm from './AnswerForm'
import App from './App'
import { useAuth } from './hooks/useAuth'

function AnswerFormContainer({ qid }: { qid: number }) {
  const { login } = useAuth()

  return (
    <AnswerForm
      disabled={login.status !== 'comp'}
      onSubmit={({ flag }) => {
        console.log({ flag })
        solve(qid, flag).then((res) => {
          const message = res.data.result.ok ? 'Configuration!!' : 'Invalid'

          alert(message)
        })

        console.log('sumbit on callback')
      }}
    />
  )
}

type Props = {
  q: Question
}
const RedirectQuestionLayout: React.FC<Props> = ({ q, children }) => {
  const { login } = useAuth()

  if (login.status === 'loading') {
    return null
  }
  if (login.status === 'auth') {
    Router.push('/register') // NOTE: not login
    return null
  }
  return (
    <Container>
      <Typography style={{ marginTop: '20px' }} variant="h4">
        {q.num}. {q.text}
      </Typography>
      <section>{children}</section>
      <AnswerFormContainer qid={q.num} />
    </Container>
  )
}

const QuestionLayout: React.FC<Props> = (props) => {
  const title = `nozctf - ${props.q.num}. ${props.q.text}`

  return (
    <App>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
      </Head>
      <RedirectQuestionLayout {...props} />
    </App>
  )
}

export default QuestionLayout
