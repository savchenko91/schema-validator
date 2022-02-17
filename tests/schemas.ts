import { Meta, createStructureValidator, isObject, Schema } from '../src'
import { ValidationError } from '../src/errors'
import { SchemaStructureValidator } from '../src/schema-structure-validator'
import { createErrorTree } from './helpers'

const handleErrorsIntoArray = (
  errors: ValidationError[] = [],
  validationErrorOrErrors?: ValidationError | ValidationError[],
): ValidationError[] => {
  if (validationErrorOrErrors instanceof ValidationError) {
    errors.push(validationErrorOrErrors)
  } else if (Array.isArray(validationErrorOrErrors)) {
    return [...errors, ...validationErrorOrErrors]
  }

  return errors
}

export const ssv1 = new SchemaStructureValidator({
  handleErrors: handleErrorsIntoArray,
})

const handleErrorsIntoObject = (
  errors: Record<string, unknown> = {},
  validationErrorOrErrors: Record<string, unknown> | ValidationError,
  meta?: Meta,
): Record<string, unknown> => {
  if (meta.path === '') {
    return Object.assign(errors, validationErrorOrErrors)
  }

  if (validationErrorOrErrors instanceof ValidationError) {
    createErrorTree(errors, meta.path, validationErrorOrErrors)
  } else if (isObject(validationErrorOrErrors)) {
    errors = Object.assign(errors, validationErrorOrErrors)
  }

  return errors
}

export const ssv2 = new SchemaStructureValidator({
  handleErrors: handleErrorsIntoObject,
  custom: {
    validateSmth() {
      return new ValidationError({
        message: 'testMessage',
        inputName: 'testSmth',
        input: 'testInput',
        code: 'testCode',
      })
    },
  },
})