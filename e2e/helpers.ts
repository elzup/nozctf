import { readFileSync } from 'node:fs'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { deleteApp, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions'

// `demo-` prefix makes the emulators refuse to touch any real project
export const PROJECT_ID = 'demo-nozctf'

type HostPort = { host: string; port: number }

// `firebase emulators:exec` exports the addresses; the fallbacks are the ports in firebase.json
function emulatorAddress(envName: string, fallbackPort: number): HostPort {
  const [host, port] = (process.env[envName] ?? '').split(':')

  if (!host || !port) return { host: '127.0.0.1', port: fallbackPort }
  return { host, port: Number(port) }
}

const FIRESTORE = emulatorAddress('FIRESTORE_EMULATOR_HOST', 8080)
const AUTH = emulatorAddress('FIREBASE_AUTH_EMULATOR_HOST', 9099)
const FUNCTIONS: HostPort = { host: FIRESTORE.host, port: 5001 }

export function createTestEnv() {
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { ...FIRESTORE, rules: readFileSync('firestore.rules', 'utf8') },
  })
}

export type CallResult = { ok: boolean; message?: string }

/** A browser-like client: its own app instance, signed in (or not) against the emulators. */
export async function createClient(name: string, shouldSignIn = true) {
  const app = initializeApp(
    { projectId: PROJECT_ID, apiKey: 'fake-api-key' },
    name
  )
  const auth = getAuth(app)
  const db = getFirestore(app)
  const functions = getFunctions(app)

  connectAuthEmulator(auth, `http://${AUTH.host}:${AUTH.port}`, {
    disableWarnings: true,
  })
  connectFirestoreEmulator(db, FIRESTORE.host, FIRESTORE.port)
  connectFunctionsEmulator(functions, FUNCTIONS.host, FUNCTIONS.port)

  const uid = shouldSignIn ? (await signInAnonymously(auth)).user.uid : ''

  const call = async (fn: string, data: unknown) =>
    (await httpsCallable<unknown, CallResult>(functions, fn)(data)).data

  return { uid, db, call, close: () => deleteApp(app) }
}

export type Client = Awaited<ReturnType<typeof createClient>>
