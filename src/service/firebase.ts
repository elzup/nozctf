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
  connectAuthEmulator,
} from 'firebase/auth'
import {
  getFirestore as _getFirestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  limit,
  writeBatch,
  connectFirestoreEmulator,
  Timestamp,
} from 'firebase/firestore'
import {
  getFunctions as _getFunctions,
  connectFunctionsEmulator,
} from 'firebase/functions'
import { GlobalSolve, ProviderType } from '../types'

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

// Same ports as `emulators` in firebase.json
const EMULATOR_HOST = 'localhost'
const EMULATOR_PORTS = { auth: 9099, firestore: 8080, functions: 5001 } as const

function getFirebaseApp() {
  if (getApps().length > 0) return getApp()

  const app = initializeApp(firebaseConfig)

  // connect*Emulator must run before the first use of each service, so do it right after init
  if (process.env.FIREBASE_USE_EMULATOR === 'true') {
    connectAuthEmulator(
      _getAuth(app),
      `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`
    )
    connectFirestoreEmulator(
      _getFirestore(app),
      EMULATOR_HOST,
      EMULATOR_PORTS.firestore
    )
    connectFunctionsEmulator(
      _getFunctions(app),
      EMULATOR_HOST,
      EMULATOR_PORTS.functions
    )
  }
  return app
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

    getDoc(doc(db, 'solve', uid))
      .then((snap) => {
        if (!snap.exists()) return
        setSolve(snap.data() as Solve)
      })
      .catch((e) => console.error('failed to load solve', e))
  }, [uid])
  return { solve } as const
}

// One document maintained by the answer function, readable without signing in
export function useGlobalSolve() {
  const [globalSolve, setGlobalSolve] = useState<GlobalSolve>({})

  useEffect(() => {
    getDoc(doc(getFirestore(), 'stats', 'solvers'))
      .then((snap) => {
        if (!snap.exists()) return
        setGlobalSolve(snap.data() as GlobalSolve)
      })
      .catch((e) => console.error('failed to load global solve', e))
  }, [])
  return { globalSolve } as const
}

export async function usableUserId(id: string): Promise<boolean> {
  const db = getFirestore()
  const indexSnap = await getDoc(doc(db, 'userid', id))

  if (indexSnap.exists()) return false

  // Users registered before /userid existed have no index doc. limit(1) is required by firestore.rules
  const q = query(collection(db, 'user'), where('id', '==', id), limit(1))
  const snapshot = await getDocs(q)

  return snapshot.empty
}

// firestore.rules only accepts the two docs together; /userid/{id} is what keeps the ID unique
export async function registerUser(uid: string, id: string) {
  const db = getFirestore()
  const batch = writeBatch(db)

  batch.set(doc(db, 'user', uid), { id })
  batch.set(doc(db, 'userid', id), { uid })
  await batch.commit()
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
