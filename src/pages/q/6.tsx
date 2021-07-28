import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

function Q() {
  const question = questions[5]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`
     WIP 
`.trim()}
      </Code>
    </QuestionLayout>
  )
}
export default Q
