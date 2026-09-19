export const QUESTION_COUNT = 9
export const MAX_FLAG_LENGTH = 100
export const MAX_INPUT_LENGTH = 100
export const MAX_PIN_LENGTH = 10

export const isValidQuestionNum = (q: unknown): q is number =>
  typeof q === 'number' && Number.isInteger(q) && q >= 1 && q <= QUESTION_COUNT

export const isShortString = (
  value: unknown,
  maxLength: number
): value is string => typeof value === 'string' && value.length <= maxLength
