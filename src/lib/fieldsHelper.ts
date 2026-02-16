import {
  type Rule,
  type SanityDocument,
  type SchemaValidationValue,
  defineField,
  type FieldDefinition,
} from "@sanity/types"
import { startCase } from "./startCase"

export type DefineFieldOutput = ReturnType<typeof defineField>

export type FieldDef = Partial<FieldDefinition> & {
  required?: boolean
}

/**
 * Convert object-based field definition to array-based field definition
 */
export const fields = (
  fieldDefs: Record<string, FieldDef>
): DefineFieldOutput[] => {
  const entries: [string, FieldDef][] = Object.entries(fieldDefs)
  return entries.map(([name, { required, ...rest }]) =>
    defineField({
      title: startCase(name),
      type: "string",
      validation: required ? buildRequiredValidation(required) : undefined,
      ...rest,
      name,
    })
  )
}

type ConditionalRequiredFn = (params: {
  value: unknown
  parent: unknown
  document?: SanityDocument | undefined
}) => SchemaValidationValue

const buildRequiredValidation = (input: boolean | ConditionalRequiredFn) =>
  typeof input === "function"
    ? (rule: Rule) =>
        rule.custom((value, { parent, document }) => {
          const fieldRequired = input({ value, parent, document })
          return fieldRequired && !value ? "Required" : true
        })
    : (rule: Rule) => rule.required()
