import { useAuthState } from 'react-firebase-hooks/auth'
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import Router from 'next/router'
import { getAuth, getFirestore } from '../service/firebase'
import { User } from '../types'
import Header from './Header'

const { auth } = getAuth()
const fdb = getFirestore()

type LoginInfo =
  | {
      status: 'none'
    }
  | {
      status: 'auth'
      uid: string
    }
  | {
      status: 'comp'
      uid: string
      user: User
    }

export const LoginContext = createContext<
  [LoginInfo, Dispatch<SetStateAction<LoginInfo>>]
>([
  { status: 'none' },
  () => {
    //
  },
])

// function useLogin() {
//   // TODO
// }

const App = ({ children }: { children?: unknown }) => {
  const [login, setLogin] = useState<LoginInfo>({ status: 'none' })
  const [fuser, loading] = useAuthState(auth)

  useEffect(() => {
    if (loading) return
    fdb
      .collection('user')
      .doc(fuser.uid)
      .get()
      .then((user) => {
        if (user.exists) {
          setLogin({
            status: 'comp',
            uid: fuser.uid,
            user: user.data() as User,
          })
        } else {
          if (Router.asPath !== '/register') {
            Router.push('/register')
          }
        }
      })
  }, [loading, fuser && fuser.uid])

  return (
    <LoginContext.Provider value={[login, setLogin]}>
      <main>
        <Header />
        {children}
      </main>
    </LoginContext.Provider>
  )
}

export default App
