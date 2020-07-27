import dynamic from 'next/dynamic'
import { Typography } from '@material-ui/core'
import { questions } from '../../questions'
import Code from '../../components/Code'

const QuestionLayout = dynamic(
  () => import('../../components/QuestionLayout'),
  {
    ssr: false,
  }
)

export default () => {
  const question = questions[1]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`
> GET / HTTP/1.1
> Host: localhost:3000
> Authorization: Basic ZW1hTnlNOlRVeTZNMWFNYmVZZg==
`.trim()}
      </Code>
      <Typography>{`FLAG_{password}`}</Typography>
    </QuestionLayout>
  )
}
