import dynamic from 'next/dynamic'
import { Typography } from '@material-ui/core'
import { questions } from '../../questions'

const QuestionLayout = dynamic(
  () => import('../../components/QuestionLayout'),
  {
    ssr: false,
  }
)

export default () => {
  const question = questions[0]

  return (
    <QuestionLayout q={question}>
      <Typography>Weolcome to nozctf. flag is `FLAG_Hel0OnozCTF`.</Typography>
    </QuestionLayout>
  )
}
