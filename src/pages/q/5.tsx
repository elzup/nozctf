import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

function Q() {
  const question = questions[4]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`
const nums = anonymousNumbers()

console.log([10, 11, 12, 13, 14].map(n => String(nums[n])))
// => [ '17', '22', '29', '39', '51' ]

const n200 = String(nums[200])

console.log(n200.length)
// => 25

const flag = \`FLAG_\${n200.toString().substr(0, 20)}\`
`.trim()}
      </Code>
    </QuestionLayout>
  )
}
export default Q
