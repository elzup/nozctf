import { useEffect, useState } from 'react'
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth as _getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth'
import {
  getFirestore as _getFirestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  getDocs as getDocsFirestore,
  Timestamp,
} from 'firebase/firestore'
import { getFunctions as _getFunctions } from 'firebase/functions'
import { GlobalSolve } from '../types'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

function getFirebaseApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig)
  }
  return getApp()
}

export function getAuth() {
  return _getAuth(getFirebaseApp())
}

export function getFirestore() {
  return _getFirestore(getFirebaseApp())
}

export function getFunctions() {
  return _getFunctions(getFirebaseApp())
}

export type Solve = Record<number, Timestamp>

export function useSolve(uid: string) {
  const [solve, setSolve] = useState<Solve>({})

  useEffect(() => {
    const db = getFirestore()

    getDoc(doc(db, 'solve', uid)).then((snap) => {
      if (!snap.exists()) return
      setSolve(snap.data() as Solve)
    })
  }, [uid])
  return { solve } as const
}

export function useGlobalSolve() {
  const [globalSolve, setGlobalSolve] = useState<GlobalSolve>({})

  useEffect(() => {
    const db = getFirestore()

    getDocsFirestore(collection(db, 'solve')).then((snap) => {
      if (snap.empty) return
      const lib: GlobalSolve = {}

      snap.forEach((d) => {
        const solves = d.data() as Solve

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

export type ProviderType = 'google' | 'twitter'

export async function usableUserId(id: string): Promise<boolean> {
  const db = getFirestore()
  const q = query(collection(db, 'user'), where('id', '==', id))
  const snapshot = await getDocs(q)

  return snapshot.empty
}

function getProvider(type: ProviderType) {
  switch (type) {
    case 'google':
      return new GoogleAuthProvider()
    case 'twitter':
      return new TwitterAuthProvider()
  }
}

export async function signin(type: ProviderType) {
  const provider = getProvider(type)
  const auth = getAuth()

  await setPersistence(auth, browserLocalPersistence)
  return signInWithPopup(auth, provider)
}

export function signout() {
  return signOut(getAuth())
}
