import { httpsCallable } from 'firebase/functions'
import config from '../config'
import { getFunctions } from './firebase'

type MessageResponse = { ok: boolean; message: string }
type SolveResponse = { ok: boolean; message?: string }

export async function solve(q: number, flag: string) {
  const answerFn = httpsCallable<{ q: number; flag: string }, SolveResponse>(
    getFunctions(),
    'answer'
  )

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

export async function tryq9(pin: string) {
  const fn = httpsCallable<{ pin: string }, MessageResponse>(
    getFunctions(),
    'tryq9'
  )

  return fn({ pin })
}

export async function tryq7(searchWord: string) {
  const response = await fetch(`${config.baseUrl}/tryq7`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchWord }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return { data: await response.text() }
}
