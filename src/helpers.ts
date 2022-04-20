import { Assertion, ValidateStructure } from '.'
import { emitAssertion } from './emit-assertion'
import { processFactory } from './process'
import { Meta, ErrorCollector, Schema } from './types'

export function createStructureValidator<TErrors>(validateStructure?: ValidateStructure<TErrors>) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & ErrorCollector<TErrors> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const newSchema = {} as any

    Object.entries(schema).forEach(([schemaKey, schemaValue]: [string, Assertion]) => {
      newSchema[schemaKey] = schemaValue

      if (typeof schemaValue === 'function') {
        newSchema[schemaKey] = (input: unknown, meta: Meta) =>
          emitAssertion(schemaValue, input, { ...meta, inputName: schemaKey })
      }

      Object.defineProperty(emitStructureValidator, schemaKey, {
        value: newSchema[schemaKey],
        writable: true,
        enumerable: true,
      })
    })

    function emitStructureValidator(input: unknown, meta: Meta): ReturnType<ErrorCollector<TErrors>> {
      const handleError = this?.handleError || that?.handleError || meta?.handleError
      if (!handleError) {
        throw new Error('"handleError" is not provided!')
      }

      const newMeta = { path: '', handleError, ...meta }

      const structureError = validateStructure?.(newSchema, input, meta)

      const errors = processFactory(newSchema, input, newMeta)

      if (errors || structureError) {
        return handleError(errors, structureError, newMeta)
      }

      return undefined
    }

    return emitStructureValidator as TSchema & ErrorCollector<TErrors>
  }
}

export const buildObjectByPath = (
  obj: Record<string, unknown>,
  pathString: string,
  value: any = null,
): Record<string, unknown> => {
  let paths = pathString.split('.')
  let current = obj
  while (paths.length > 1) {
    const [head, ...tail] = paths
    paths = tail
    if (current[head] === undefined) {
      current[head] = {}
    }
    current = current[head] as Record<string, unknown>
  }
  if (value) {
    const oldValue = current[paths[0]] as any
    current[paths[0]] = { ...oldValue, ...value }
  }
  return obj
}
