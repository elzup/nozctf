import Link from 'next/link'
import { questions } from '../questions'
import Header from './Header'

const App = ({ children }: { children?: unknown }) => (
  <main>
    <Header />
    {children}
  </main>
)

export default App
