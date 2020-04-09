import { Typography } from '@material-ui/core'
import { useContext } from 'react'
import { getFirestore } from '../service/firebase'
import { Question } from '../types'
import App, { LoginContext } from './App'
import AnswerForm from './AnswerForm'

const fdb = getFirestore()

type Props = {
  q: Question
}
const QuestionLayout: React.FC<Props> = ({ q, children }) => {
  const [login] = useContext(LoginContext)

  return (
    <App>
      <Typography variant="h4">
        {q.num}. {q.text}
      </Typography>
      <section>{children}</section>
      <AnswerForm
        disabled={login.status !== 'comp'}
        onSubmit={(v) => {
          // v.flag
        }}
      />
    </App>
  )
}

export default QuestionLayout
