import { GlobalSolve } from '../types'

export function countSolves(solves: Record<number, unknown>[]): GlobalSolve {
  return solves
    .flatMap((solve) => Object.keys(solve).map(Number))
    .reduce<GlobalSolve>(
      (lib, k) => ({ ...lib, [k]: { count: (lib[k]?.count ?? 0) + 1 } }),
      {}
    )
}
