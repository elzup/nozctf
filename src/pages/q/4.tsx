import { Button, TextField, Typography } from '@material-ui/core'
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
  searchId: Yup.string().required('required'),
})

function SearchForm() {
  const formik = useFormik<Fields>({
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
    <div
      style={{
        border: 'solid 1px #e0e0e0',
        padding: '20px',
        borderRadius: '4px',
        boxShadow: '0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%)',
        margin: '4px 0',
        width: '600px',
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyContent: 'left',
          columnGap: '8px',
          alignItems: 'center',
        }}
      >
        <Typography>Search User</Typography>
        <TextField
          name="searchId"
          value={formik.values.searchId}
          label="user id"
          variant="outlined"
          onChange={(e) => {
            formik.setFieldValue(
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
    </div>
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
