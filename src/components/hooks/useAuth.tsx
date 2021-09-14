import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { getAuth, getFirestore, signout } from '../../service/firebase'
import { LoginInfo, User } from '../../types'

const authContext = createContext({} as ReturnType<typeof useProvideAuth>)

export function ProvideAuth({ children }: { children: ReactNode }) {
  const auth = useProvideAuth()

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [login, setLogin] = useState<LoginInfo>({ status: 'loading' })

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (fuser) => {
      if (!fuser) {
        setLogin({ status: 'none' })
        return
      }
      const { uid } = fuser
      const fdb = getFirestore()
      const userSnap = await fdb.collection('user').doc(uid).get()

      if (!userSnap.exists) {
        setLogin({ status: 'auth', uid })
        return
      }
      const user = userSnap.data() as User

      setLogin({ status: 'comp', user, uid })
    })

    return () => unsubscribe()
  }, [])

  return {
    login,
    setLogin,
    signout: () => signout().then(() => setLogin({ status: 'none' })),
  }
}
