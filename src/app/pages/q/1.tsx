import { useRouter } from 'next/dist/client/router'
import QuestionLayout from '../../components/QuestionLayout'

export default () => {
  const router = useRouter()
  const qid = Number(router.query.id)

  return <QuestionLayout qid={qid}>計算結果を答えてください。</QuestionLayout>
}
