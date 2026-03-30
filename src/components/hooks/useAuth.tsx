import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
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
    const unsubscribe = onAuthStateChanged(getAuth(), async (fuser) => {
      if (!fuser) {
        setLogin({ status: 'none' })
        return
      }
      const { uid } = fuser
      const db = getFirestore()
      const userSnap = await getDoc(doc(db, 'user', uid))

      if (!userSnap.exists()) {
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
