import { createTheme } from '@material-ui/core'
import { indigo, lightBlue } from '@material-ui/core/colors'
import { createGlobalStyle } from 'styled-components'

export const makeTheme = (isDark: boolean) =>
  createTheme({
    palette: {
      type: isDark ? 'dark' : 'light',
      primary: {
        ...indigo,
        main: indigo[900],
      },
      secondary: {
        ...lightBlue,
        main: lightBlue[500],
      },
    },
  })

export const GlobalStyle = createGlobalStyle`
@media (prefers-color-scheme: dark) {
  a {
    color: #8ab4f8;
    &:visited {
      color: rgb(197, 138, 249);
    }
  }
}
`
