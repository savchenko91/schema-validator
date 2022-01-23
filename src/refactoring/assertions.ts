import { isEmptyString } from '.'
import { isNumber, isString, isNil, isBoolean, isNull } from './is'

export function assertNil(input: unknown): input is undefined | null {
  if (isNil(input)) {
    return
  }

  throw Error('is not nil')
}

export function assertNotNil<T>(input: T | undefined | null): input is T {
  if (!isNil(input)) {
    return
  }

  throw Error('is nil')
}

export function assertNull(input: unknown): input is null {
  if (isNull(input)) {
    return
  }

  throw Error('is not null')
}

export function assertNotNull<T>(input: T | null): input is T {
  if (!isNull(input)) {
    return
  }

  throw Error('is null')
}

export function assertNumber(input: unknown): asserts input is number {
  if (isNumber(input)) {
    return
  }

  throw Error('is not a number')
}

export function assertString(input: unknown): asserts input is string {
  if (isString(input)) {
    return
  }

  throw Error('is not a string')
}

export function assertEmptyString(input: unknown): asserts input is '' {
  if (isEmptyString(input)) {
    return
  }

  throw Error('is not a string')
}

export function assertNotEmptyString<T>(input: T | ''): asserts input is T {
  if (!isEmptyString(input)) {
    return
  }

  throw Error('is an empty string')
}

export function assertBoolean(input: unknown): asserts input is boolean {
  if (isBoolean(input)) {
    return
  }

  throw Error('is not a boolean')
}

export function assertNotUndefined<T>(input: unknown | undefined): asserts input is T {
  if (typeof input === 'undefined') {
    throw Error('cannot be undefined')
  }
}

export function assertUndefined(input: undefined): asserts input is undefined {
  if (typeof input !== 'undefined') {
    throw Error('cannot be undefined')
  }
}

export function assertNotNaN(input: unknown): void {
  assertNumber(input)

  if (Number.isNaN(input)) {
    throw Error('is not a number')
  }
}

export function assertNotMoreThan(input: unknown, num: unknown): void {
  if (!isNumber(input) && !isString(input)) {
    throw Error(`must be a string or number`)
  }

  if (!isNumber(num) && !isString(num)) {
    throw Error(`must be a string or number`)
  }

  const inputNum = isNumber(input) ? input : parseInt(input, 10)
  const numNum = isNumber(num) ? num : parseInt(num, 10)

  assertNotNaN(inputNum)
  assertNotNaN(numNum)

  if (inputNum <= numNum) {
    return
  }

  throw Error(`more than ${num}`)
}

export function assertStringMaxLength(input: unknown, num: unknown): void {
  assertString(input)

  assertNotMoreThan(input.length, num)
}

export function assertStringifiedNumber(input: unknown): void {
  try {
    assertString(input)
    assertNotNaN(parseInt(input, 10))
  } catch (e) {
    throw Error(`is not a stringified number`)
  }
}

export function assertRegExp(input: unknown): asserts input is RegExp {
  if (!isString(input) && !(input instanceof RegExp)) {
    throw Error(`is not a regular expression`)
  }

  try {
    RegExp(input as string)
  } catch (e) {
    throw Error(`is not a regular expression`)
  }
}

export function assertMatchPattern(input: unknown, pattern: unknown): void {
  assertString(input)
  assertRegExp(pattern)

  const regExp = new RegExp(pattern)

  if (!regExp.test(input)) {
    throw new Error('does not match the pattern')
  }
}