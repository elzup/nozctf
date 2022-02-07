import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import { TryFormBox } from '../../components/commons'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'
import { tryq8 } from '../../service/api'

type Fields = {
  n: number
}

const validationSchema = Yup.object().shape({
  n: Yup.number().required('required'),
})

function SearchForm() {
  const { values, handleSubmit, handleChange } = useFormik<Fields>({
    initialValues: { n: 0 },
    onSubmit: ({ n }) => {
      console.log({ n })
      tryq8(n).then((res) => alert(res.data.result.message))
    },
    validate: () => ({}),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
  })

  return (
    <TryFormBox>
      <Typography>{'integer'}</Typography>
      <form onSubmit={handleSubmit}>
        <Typography>send integer</Typography>
        <TextField
          name="n"
          value={values.n}
          label="n"
          type="number"
          // inputProps={{ max: 100 }}
          variant="outlined"
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
      </form>
    </TryFormBox>
  )
}

function Q() {
  const question = questions[8 - 1]

  return (
    <QuestionLayout q={question}>
      <Code lang="javascript">
        {`
// node.js
const isInteger = (n) => n <= parseInt(n)

function eight(n) {
  if (typeof n !== 'number') return 'invalid: no number'
  if (/* double check !!!! */ !!!Number.isInteger(n)) {
    if (/* double check !!!!!!! */ isInteger(n)) {
      return 'FLAG_????????????????????'
    }
  }

  return 'non integer'
}
        `.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}

export default Q
