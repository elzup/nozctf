import { MuiThemeProvider } from '@material-ui/core/styles'

import { ReactNode } from 'react'
import { theme } from '../theme'
import Header from './Header'
import { ProvideAuth } from './hooks/useAuth'

const App = ({ children }: { children: ReactNode }) => {
  return (
    <MuiThemeProvider theme={theme}>
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
