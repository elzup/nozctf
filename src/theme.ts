import { createMuiTheme } from '@material-ui/core/styles'
import { indigo, lightBlue } from '@material-ui/core/colors'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[900],
    },
    secondary: {
      main: lightBlue[500],
    },
  },
})
