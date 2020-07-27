import dynamic from 'next/dynamic'
import { questions } from '../../questions'

const QuestionLayout = dynamic(
  () => import('../../components/QuestionLayout'),
  {
    ssr: false,
  }
)

export default () => {
  const question = questions[0]

  return <QuestionLayout q={question}>`FLAG_Hel0OnozCTF`</QuestionLayout>
}
