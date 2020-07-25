import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { LoginInfo, User } from '../../types'
import { init, getFirestore } from '../../service/firebase'

init()

const authContext = createContext({} as ReturnType<typeof useProvideAuth>)

export function ProvideAuth({ children }: { children: ReactNode }) {
  const auth = useProvideAuth()

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [login, setLogin] = useState<LoginInfo>({ status: 'none' })

  const signin = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const auth = firebase.auth()

    if (typeof window !== undefined) {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    }
    auth.signInWithPopup(provider)
  }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setLogin({ status: 'none' })
      })
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fuser) => {
      if (!fuser) {
        setLogin({ status: 'none' })
        return
      }
      const { uid } = fuser
      const fdb = getFirestore()
      const user = (await fdb.collection('user').doc(uid).get()) as User

      if (user) {
        setLogin({ status: 'comp', user, uid })
      } else {
        setLogin({ status: 'auth', uid })
      }
    })

    return () => unsubscribe()
  }, [])

  return {
    login,
    signin,
    signout,
  }
}
