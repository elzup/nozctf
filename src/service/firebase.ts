import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useEffect, useState } from 'react'
import { GlobalSolve, ProviderType } from '../types'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measumentId: process.env.FIREBASE_MEASUREMENT_ID,
}

export const init = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
}

export const getAuth = () => {
  init()
  return firebase.auth()
}

export const getFirestore = () => {
  init()
  return firebase.firestore()
}
const solveRef = () => getFirestore().collection('solve')

export type Solve = Record<number, firebase.firestore.Timestamp>

export const useSolve = (uid: string) => {
  const [solve, setSolve] = useState<Solve>({})

  useEffect(() => {
    solveRef()
      .doc(uid)
      .get()
      .then((snap) => {
        if (!snap.exists) return
        setSolve(snap.data() as Solve)
      })
  }, [uid])
  return { solve } as const
}

export const useGlobalSolve = () => {
  const [globalSolve, setGlobalSolve] = useState<GlobalSolve>({})

  useEffect(() => {
    solveRef()
      .get()
      .then((snap) => {
        if (snap.empty) return
        const lib: GlobalSolve = {}

        snap.forEach((doc) => {
          const solves = doc.data() as Solve

          Object.keys(solves)
            .map(Number)
            .forEach((k) => {
              if (!lib[k]) {
                lib[k] = { count: 0 }
              }
              lib[k].count += 1
            })
        })

        setGlobalSolve(lib)
      })
  }, [])
  return { globalSolve } as const
}

export const usableUserId = async (userId: string) => {
  const fdb = getFirestore()
  const docs = await fdb.collection('user').where('id', '==', userId).get()

  return docs.size === 0
}

export const getProvider = (providerType: ProviderType) => {
  switch (providerType) {
    case 'google':
      return new firebase.auth.GoogleAuthProvider()
    case 'twitter':
      return new firebase.auth.TwitterAuthProvider()
  }
}

export const signin = (providerType: ProviderType) => {
  const provider = getProvider(providerType)
  const auth = firebase.auth()

  if (typeof window !== undefined) {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  }
  auth.signInWithPopup(provider)
}

export const signout = () => {
  return firebase.auth().signOut()
}
