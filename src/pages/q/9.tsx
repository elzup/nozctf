import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import Code from '../../components/Code'
import { TryFormBox } from '../../components/commons'
import QuestionLayout from '../../components/QuestionLayout'
import { SIGN_IN_TO_TRY, useCanTry } from '../../components/hooks/useAuth'
import { questions } from '../../questions'
import { tryq9 } from '../../service/api'

type Fields = {
  pin: string
}

const validationSchema = Yup.object().shape({
  pin: Yup.string().max(10).required('required'),
})

function SearchForm() {
  const canTry = useCanTry()
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')

  const { values, handleSubmit, handleChange, isSubmitting } =
    useFormik<Fields>({
      initialValues: { pin: '' },
      onSubmit: async ({ pin }) => {
        const start = Date.now()

        try {
          const res = await tryq9(pin)
          const ms = Date.now() - start

          setElapsed(ms)
          setMessage(res.data.message)
        } catch (e) {
          console.error('tryq9 failed', e)
          setElapsed(Date.now() - start)
          setMessage('error')
        }
      },
      validate: () => ({}),
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    })

  return (
    <TryFormBox>
      <form onSubmit={handleSubmit}>
        <Typography>PIN</Typography>
        <TextField
          name="pin"
          value={values.pin}
          label="pin"
          inputProps={{ maxLength: 10 }}
          variant="outlined"
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!canTry || isSubmitting}
        >
          Try
        </Button>
      </form>
      {!canTry && <Typography>{SIGN_IN_TO_TRY}</Typography>}
      {elapsed !== null && (
        <Typography variant="h6" style={{ marginTop: 16 }}>
          {`Response time: ${elapsed}ms`}
        </Typography>
      )}
      {message && <Typography style={{ marginTop: 8 }}>{message}</Typography>}
    </TryFormBox>
  )
}

function Q() {
  const question = questions[9 - 1]

  return (
    <QuestionLayout q={question}>
      <Code lang="javascript">
        {`
// Cloud Function (Node.js)
const PIN = '????'

async function checkPin(pin) {
  for (let i = 0; i < PIN.length; i++) {
    if (pin[i] !== PIN[i]) {
      return 'wrong pin'
    }
    await sleep(300) // takes time per correct digit...
  }

  return 'Correct! FLAG_????'
}
        `.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}

export default Q
