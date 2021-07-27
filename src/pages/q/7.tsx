import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

function Q() {
  const question = questions[7 - 1]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`

        `.trim()}
      </Code>
    </QuestionLayout>
  )
}
new Regex()
export default Q
