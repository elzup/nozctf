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
    onSubmit: ({ searchId }) => {
      if (!preTry(searchId)) {
        alert('user not found')
        return
      }
      tryq4(searchId).then((res) => {
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
        maxWidth: '400px',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <TextField
        name="searchId"
        value={formik.values.searchId}
        label="検索ID"
        variant="outlined"
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

      <Button type="submit" variant="contained">
        Search
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
  { id: 'ben', deleted: true },
]
const userById = {}

users.forEach((user) => {
  userById[user.id] = user
})

function existsUser(searchId) {
  if (searchId.length > 8) {
    return false
  }
  const user = userById[searchId]

  return user && !user.deleted
}

function searchUser(searchId) {
  if (!existsUser(searchId)) {
    return 'user not found'
  }
  return \`FLAG_???????????????\`
}
`.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}
const users = [
  { id: 'popout', deleted: true },
  { id: 'molis', deleted: true },
  { id: 'ben', deleted: true },
]
const userById: Record<string, typeof users[0]> = {}

users.forEach((user) => {
  userById[user.id] = user
})

function existsUser(searchId: string) {
  if (searchId.length > 8) {
    return false
  }
  const user = userById[searchId]

  return user && !user.deleted
}

function preTry(searchId: string) {
  return existsUser(searchId)
}
