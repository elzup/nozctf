import { Typography, Container } from '@material-ui/core'
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
          const message = res.data.result.ok ? '正解！' : 'はずれ'

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
const QuestionLayout: React.FC<Props> = ({ q, children }) => {
  return (
    <App>
      <Container>
        <Typography variant="h4">{q.text}</Typography>
        <section>{children}</section>
        <AnswerFormContainer qid={q.num} />
      </Container>
    </App>
  )
}

export default QuestionLayout
