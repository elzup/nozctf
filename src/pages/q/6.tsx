import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import { TryFormBox } from '../../components/commons'
import QuestionLayout from '../../components/QuestionLayout'
import { SIGN_IN_TO_TRY, useCanTry } from '../../components/hooks/useAuth'
import { questions } from '../../questions'
import { tryq6 } from '../../service/api'
import { alertError } from '../../utils'

type Fields = {
  word: string
}

const validationSchema = Yup.object().shape({
  word: Yup.string().max(7).required('required'),
})

function SearchForm() {
  const canTry = useCanTry()
  const { handleSubmit, values, errors, handleChange } = useFormik<Fields>({
    initialValues: { word: '' },
    onSubmit: ({ word }) => {
      tryq6(word)
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
      <form onSubmit={handleSubmit}>
        <Typography>six(</Typography>
        <TextField
          name="word"
          value={values.word}
          size="small"
          label="ssssssQ"
          inputProps={{ maxLength: 8 }}
          variant="outlined"
          helperText={errors.word}
          error={!!errors.word}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <Typography>)</Typography>
        <Button type="submit" variant="contained" disabled={!canTry}>
          {'⏎'}
        </Button>
      </form>
      {!canTry && <Typography>{SIGN_IN_TO_TRY}</Typography>}
    </TryFormBox>
  )
}

function Q() {
  const question = questions[5]

  return (
    <QuestionLayout q={question}>
      <Code lang="js">
        {`
function six(ssssssQ) {
  if (typeof ssssssQ !== 'string') return 'invalid: no string'
  if ([...ssssssQ].length > 6) return 'invalid: too long'
  if (ssssssQ[6] !== 'Q') return 'invalid'
  return 'FLAG_*******************'
}
`.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}
export default Q
