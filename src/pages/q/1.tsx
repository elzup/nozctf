import { Typography } from '@material-ui/core'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

function Q() {
  const question = questions[0]

  return (
    <QuestionLayout q={question}>
      <Typography>Weolcome to nozctf. flag is `FLAG_Hel0OnozCTF`.</Typography>
    </QuestionLayout>
  )
}
export default Q
