export type User = {
  id: string
}

export type Action = {
  name: string
}

export type Commit = {
  text: string
  timestamp: number
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

export type Solve = {
  solvedAt: number
}
export type GlobalSolve = {
  [quesitonId: number]: {
    count: number
  }
}

export type Solves = {
  [userId: string]: {
    [qid: string]: Solve
  }
}

export const PROVIDER_TYPE_GOOGLE = 'google'
export const PROVIDER_TYPE_TWITTER = 'twitter'
export const PROVIDER_TYPES = [
  PROVIDER_TYPE_GOOGLE,
  PROVIDER_TYPE_TWITTER,
] as const

export type ProviderType = typeof PROVIDER_TYPES[number]
