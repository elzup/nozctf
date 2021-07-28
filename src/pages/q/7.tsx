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
      tryq7(searchWord).then((res) => alert(res.data))
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
      <Typography>{'X CAN YOU SEE ANYTHING Q'}</Typography>
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
string pattern = await reader.ReadLineAsync();
string sentence = "X CAN YOU SEE ANYTHING Q";

try {
  foreach(Match match in Regex.Matches(sentence, pattern,
    RegexOptions.None,
    TimeSpan.FromSeconds(1))) {
    await response.WriteAsync(match.Value);
  }
} catch (RegexMatchTimeoutException) {
  await response.WriteAsync($"Found 'FLAG_{***********}'");
}
        `.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}

export default Q
