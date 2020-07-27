import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useEffect, useState } from 'react'

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

export const getFirestore = () => {
  init()
  return firebase.firestore()
}
export const solveRef = (uid: string) => {
  return getFirestore().collection('solve').doc(uid)
}

type Solve = Record<number, firebase.firestore.Timestamp>

export const useSolve = (uid: string) => {
  const [solve, setSolve] = useState<Solve>({})

  useEffect(() => {
    solveRef(uid)
      .get()
      .then((snap) => {
        if (!snap.exists) return
        setSolve(snap.data() as Solve)
      })
  }, [uid])
  return { solve } as const
}

export const usableUserId = async (userId: string) => {
  const fdb = getFirestore()
  const docs = await fdb.collection('user').where('id', '==', userId).get()

  return docs.size === 0
}
