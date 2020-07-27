import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

export default () => {
  const question = questions[2]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`
$ echo -n $FOOD | shasum -a 256
b493d48364afe44d11c0165cf470a4164d1e2609911ef998be868d46ade3de4e  -
$ echo -n $WEATHER | shasum -a 512
60e00ebd283eacdcea353a2f943e57abe04406cf8506413224d55f270b255c60c2d0d3b62e1c63181f2affc2a264ae9196feda06518ff087aee76e9582a28662  -
$ echo FLAG_$(echo $FOOD$WEATHER |md5)
`.trim()}
      </Code>
    </QuestionLayout>
  )
}
