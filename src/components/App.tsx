import Header from './Header'
import { ProvideAuth } from './hooks/useAuth'

const App = ({ children }: { children?: unknown }) => {
  return (
    <ProvideAuth>
      <main>
        <Header />
        {children}
      </main>
    </ProvideAuth>
  )
}

export default App
