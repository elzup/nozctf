import { httpsCallable } from 'firebase/functions'
import { getFunctions, getAuth } from './firebase'

const API_BASE = 'https://nozctf.web.app'

type MessageResponse = { ok: boolean; message: string }

export async function solve(q: number, flag: string) {
  const answerFn = httpsCallable<
    { q: number; flag: string },
    { ok: boolean }
  >(getFunctions(), 'answer')

  return answerFn({ q, flag })
}

export async function tryq4(searchId: string) {
  const fn = httpsCallable<{ searchId: string }, MessageResponse>(
    getFunctions(),
    'tryq4'
  )

  return fn({ searchId })
}

export async function tryq6(word: string) {
  const fn = httpsCallable<{ word: string }, MessageResponse>(
    getFunctions(),
    'tryq6'
  )

  return fn({ word })
}

export async function tryq8(n: number) {
  const fn = httpsCallable<{ n: number }, MessageResponse>(
    getFunctions(),
    'tryq8'
  )

  return fn({ n })
}

export async function tryq7(searchWord: string) {
  const response = await fetch(`${API_BASE}/tryq7`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchWord }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return { data: await response.text() }
}

export async function preTry(searchWord: string) {
  const user = getAuth().currentUser

  if (!user) return false
  const idToken = await user.getIdToken()

  const response = await fetch(`${API_BASE}/try`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ searchWord }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return { data: await response.json() }
}
