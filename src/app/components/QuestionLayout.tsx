import { Typography } from '@material-ui/core'
import { useContext } from 'react'
import axios from 'axios'
import { getFirestore } from '../service/firebase'
import { Question } from '../types'
import App, { LoginContext } from './App'
import AnswerForm from './AnswerForm'

const fdb = getFirestore()

function AnswerFormContainer({ qid }: { qid: number }) {
  const [login] = useContext(LoginContext)

  return (
    <AnswerForm
      disabled={login.status !== 'comp'}
      onSubmit={({ flag }) => {
        console.log({ flag })

        console.log('sumbit on callback')
        axios
          .post('/solve', { q: qid, flag })
          .then(console.log)
          .catch(console.error)
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
      <Typography variant="h4">
        {q.num}. {q.text}
      </Typography>
      <section>{children}</section>
      <AnswerFormContainer qid={q.num} />
    </App>
  )
}

export default QuestionLayout
