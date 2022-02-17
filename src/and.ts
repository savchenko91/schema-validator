import { isPrimitive } from '.'
import { ValidationError } from './errors'
import { Primitive } from './types'

export const and: Primitive = (...assertionItems) => {
  return function emitAssertion(input, meta) {
    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertion = assertionItems[index]

      try {
        assertion(input, meta)
      } catch (error) {
        if (error instanceof ValidationError) {
          return error
        }
        if (error instanceof Error) {
          return new ValidationError({
            inputName: meta?.inputName,
            input: isPrimitive(input) ? input : input?.toString(),
            code: assertion?.name,
            message: error.message,
          })
        }
      }
    }

    return undefined
  }
}