import { Typography } from '@material-ui/core'
import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

function Q() {
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
export default Q
