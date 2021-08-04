import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import { TryFormBox } from '../../components/commons'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'
import { tryq4 } from '../../service/api'

type Fields = {
  searchId: string
}

const validationSchema = Yup.object<Fields>().shape({
  searchId: Yup.string().required('required'),
})

function SearchForm() {
  const { values, setFieldValue, handleSubmit } = useFormik<Fields>({
    initialValues: { searchId: '' },
    onSubmit: ({ searchId }) => {
      if (!preTry(searchId)) return alert('User not found')
      tryq4(searchId).then((res) => alert(res.data.result.message))
    },
    validate: () => ({}),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
  })

  return (
    <TryFormBox>
      <form onSubmit={handleSubmit}>
        <Typography>Search User</Typography>
        <TextField
          name="searchId"
          value={values.searchId}
          label="user id"
          variant="outlined"
          onChange={(e) => {
            setFieldValue(
              'searchId',
              e.target.value.trim().replace(/[^_0-9a-zA-Z]/g, '')
            )
          }}
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
  const question = questions[3]

  return (
    <QuestionLayout q={question}>
      <Code lang="js">
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
    return 'User not found'
  }
  return \`User found! FLAG_???????????????\`
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
  if (searchId.length > 8) return false

  const user = userById[searchId]

  return user && !user.deleted
}

function preTry(searchId: string) {
  return existsUser(searchId)
}
export default Q
