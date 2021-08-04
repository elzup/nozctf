import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'

import { TryFormBox } from '../../components/commons'

import { tryq6 } from '../../service/api'

type Fields = {
  word: string
}

const validationSchema = Yup.object<Fields>().shape({
  word: Yup.string().required('required'),
})

function SearchForm() {
  const { handleSubmit, values, handleChange } = useFormik<Fields>({
    initialValues: { word: '' },
    onSubmit: ({ word }) => {
      console.log({ word })
      // if (!preTry(searchWord)) return alert('User not found')
      tryq6(word).then((res) => alert(res.data))
    },
    validate: () => ({}),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
  })

  return (
    <TryFormBox>
      <form onSubmit={handleSubmit}>
        <Typography>Post Word</Typography>
        <TextField
          name="word"
          value={values.word}
          label="word"
          inputProps={{ max: 10 }}
          variant="outlined"
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </TryFormBox>
  )
}

function Q() {
  const question = questions[5]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`
     WIP 
`.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}
export default Q
