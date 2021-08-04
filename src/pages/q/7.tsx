import { Button, TextField, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Code from '../../components/Code'
import { TryFormBox } from '../../components/commons'
import QuestionLayout from '../../components/QuestionLayout'
import { questions } from '../../questions'
import { tryq7 } from '../../service/api'

type Fields = {
  searchWord: string
}

const validationSchema = Yup.object<Fields>().shape({
  searchWord: Yup.string().max(10).required('required'),
})

function SearchForm() {
  const { values, handleSubmit, handleChange } = useFormik<Fields>({
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
    <TryFormBox>
      <Typography>{'X CAN YOU SEE ANYTHING Q'}</Typography>
      <form onSubmit={handleSubmit}>
        <Typography>Search Word</Typography>
        <TextField
          name="searchWord"
          value={values.searchWord}
          label="word"
          inputProps={{ maxLength: 10 }}
          variant="outlined"
          onChange={handleChange}
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
  const question = questions[7 - 1]

  return (
    <QuestionLayout q={question}>
      <Code lang="csharp">
        {`
// C#
static string QTEXT = "X CAN YOU SEE ANYTHING Q";
public static string search(string pattern)
{
  if (pattern.Length > 10) return "Error! too long";

  try {
    Match m = Regex.Match(QTEXT, pattern, RegexOptions.None, TimeSpan.FromSeconds(1));
    if (m.Success) {
      return $"Find! {m.Value}";
    } else {
      return "No Hit";
    }
  }
  catch (RegexMatchTimeoutException) {
    return $"TIMEOUT! 'FLAG_*********'";
  }
  catch (ArgumentException) {
    return $"Invalid regex";
  }
}
        `.trim()}
      </Code>
      <SearchForm />
    </QuestionLayout>
  )
}

export default Q
