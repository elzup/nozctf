import { Button, TextField } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'
import { tryq4 } from '../../service/api'

type Fields = {
  searchId: string
}

const validationSchema = Yup.object<Fields>().shape({
  searchId: Yup.string().required('入力してください'),
})

function SearchForm() {
  const formik = useFormik<Fields>({
    initialValues: { searchId: '' },
    onSubmit: (values, { setErrors }) => {
      tryq4(values.searchId).then((res) => {
        alert(res.data.message)
      })
    },
    validate: () => ({}),

    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: 'flex',
        maxWidth: '400px',
        flexDirection: 'column',
      }}
    >
      <TextField
        name="searchId"
        label="FLAG_..."
        value={formik.values.searchId}
        onChange={(e) => {
          formik.setFieldValue(
            'searchId',
            e.target.value.trim().replace(/[^_0-9a-zA-Z]/g, '')
          )
        }}
        type="text"
        autoComplete="off"
        margin="normal"
        required
      />

      <Button
        type="submit"
        variant="outlined"
        color="primary"
        // disabled={props.disabled}
      >
        Submit
      </Button>
    </form>
  )
}

export default () => {
  const question = questions[3]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`

const users = [
  { id: 'popout', deleted: true },
  { id: 'molis', deleted: true },
  { idd: 'ben', deleted: true },
}
const userById = {}

users.forEach((user) => {
  userById[user.id] = user
})

function existsUser(searchId) {
  if (searchId > 8) return false
  const user = userById[searchId]

  return user && !user.deleted
}

`.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}
