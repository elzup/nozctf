export type User = {
  id: string
}

export type Question = {
  num: number
  text: string
}

export type LoginInfo =
  | {
      status: 'loading'
    }
  | {
      status: 'none'
    }
  | {
      status: 'auth'
      uid: string
    }
  | {
      status: 'comp'
      uid: string
      user: User
    }

/** Solver count per question, as stored in stats/solvers */
export type GlobalSolve = {
  [questionNum: number]: number
}

export const PROVIDER_TYPE_GOOGLE = 'google'
export const PROVIDER_TYPE_TWITTER = 'twitter'
export const PROVIDER_TYPES = [
  PROVIDER_TYPE_GOOGLE,
  PROVIDER_TYPE_TWITTER,
] as const

export type ProviderType = (typeof PROVIDER_TYPES)[number]
