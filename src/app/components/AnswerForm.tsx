import { TextField, Button } from '@material-ui/core'
import * as React from 'react'
import { useFormik, FormikErrors } from 'formik'
import * as Yup from 'yup'

type Fields = {
  flag: string
}
export type Props = {
  disabled: boolean
  onSubmit: (
    fields: Fields,
    setErrors: (errors: FormikErrors<Fields>) => void
  ) => void
}

const schema = Yup.object().shape({
  username: Yup.string().max(20, 'IDが長すぎます').required('入力してください'),
})

function AnswerForm(props: Props) {
  const formik = useFormik<Fields>({
    initialValues: { flag: '' },
    onSubmit: (values, { setErrors }) => props.onSubmit(values, setErrors),
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: schema,
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
        name="flag"
        label="Flag"
        value={formik.values.flag}
        disabled={props.disabled}
        helperText={props.disabled && 'need login'}
        onChange={(e) => {
          formik.setFieldValue(
            'flag',
            e.target.value
              .trim()
              .replace(/[^_0-9a-zA-Z]/g, '')
              .toLowerCase()
          )
        }}
        type="text"
        autoComplete="username"
        margin="normal"
        required
      />

      <Button
        type="submit"
        variant="outlined"
        color="primary"
        disabled={props.disabled}
      >
        Submit
      </Button>
    </form>
  )
}

export default AnswerForm
