import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import { TryFormBox } from '../../components/commons'
import QuestionLayout from '../../components/QuestionLayout'
import { SIGN_IN_TO_TRY, useCanTry } from '../../components/hooks/useAuth'
import { questions } from '../../questions'
import { tryq8 } from '../../service/api'
import { alertError } from '../../utils'

type Fields = {
  n: number
}

const validationSchema = Yup.object().shape({
  n: Yup.number().required('required'),
})

function SearchForm() {
  const canTry = useCanTry()
  const { values, handleSubmit, handleChange } = useFormik<Fields>({
    initialValues: { n: 0 },
    onSubmit: ({ n }) => {
      tryq8(n)
        .then((res) => alert(res.data.message))
        .catch(alertError)
    },
    validate: () => ({}),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
  })

  return (
    <TryFormBox>
      <Typography>{'non integer'}</Typography>
      <form onSubmit={handleSubmit}>
        <Typography>send non integer</Typography>
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
        <Button type="submit" variant="contained" disabled={!canTry}>
          Search
        </Button>
      </form>
      {!canTry && <Typography>{SIGN_IN_TO_TRY}</Typography>}
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
  if (n < 0) return 'invalid: negative'
  if (Number.isInteger(n)) return 'invalid: integer'
  if (!isInteger(n)) return 'non integer'
  return 'FLAG_????????????????????'
}
        `.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}

export default Q
