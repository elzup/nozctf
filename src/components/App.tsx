import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import { GlobalStyle, makeTheme } from '../theme'
import Header from './Header'
import { ProvideAuth } from './hooks/useAuth'

const App: React.FC = ({ children }) => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(() => makeTheme(isDark), [isDark])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <ProvideAuth>
        <main>
          <Header />
          {children}
        </main>
      </ProvideAuth>
    </MuiThemeProvider>
  )
}

export default App
