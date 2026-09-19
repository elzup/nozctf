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

      try {
        const userSnap = await getDoc(doc(getFirestore(), 'user', uid))

        if (!userSnap.exists()) {
          setLogin({ status: 'auth', uid })
          return
        }
        setLogin({ status: 'comp', user: userSnap.data() as User, uid })
      } catch (e) {
        // Without this the whole app stays on 'loading' forever when Firestore is unreachable
        console.error('failed to load user', e)
        setLogin({ status: 'none' })
      }
    })

    return () => unsubscribe()
  }, [])

  return {
    login,
    setLogin,
    signout: () => signout().then(() => setLogin({ status: 'none' })),
  }
}
