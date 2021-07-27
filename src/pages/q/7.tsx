import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'
import { tryq7 } from '../../service/api'

type Fields = {
  searchWord: string
}

const validationSchema = Yup.object<Fields>().shape({
  searchWord: Yup.string().required('required'),
})

function SearchForm() {
  const formik = useFormik<Fields>({
    initialValues: { searchWord: '' },
    onSubmit: ({ searchWord }) => {
      console.log({ searchWord })
      // if (!preTry(searchWord)) return alert('User not found')
      tryq7(searchWord).then((res) => alert(res.data.result.message))
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
        <Typography>Search Word</Typography>
        <TextField
          name="searchWord"
          value={formik.values.searchWord}
          label="word"
          variant="outlined"
          onChange={(e) => {
            formik.setFieldValue('searchWord', e.target.value)
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

function Q() {
  const question = questions[7 - 1]

  return (
    <QuestionLayout q={question}>
      <Code>
        {`
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function tryq7(searchWord) {
  if (searchWord.length > 12) return { ok: false, message: 'Too long' }

  const lorem = \`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\`.replace(
    /[,.]/g,
    ''
  )

  const search = async (word: string) => {
    const m = new RegExp(word).exec(lorem)

    return m ? m[0] : 'no hit'
  }
  const timeout = async (ms: number) => {
    await sleep(ms)
    const message = \`Timeout! FLAG_??????????????????\`

    return message
  }

  const res = await Promise.race([search(searchWord), timeout(3000)])

  return { ok: true, res }
)

        `.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}

export default Q
