import { defineField } from "@sanity/types"
import { startCase } from "./startCase"

/**
 * Convert object-based field definition to array-based field definition
 *
 * @param {object} fieldDefs
 */
export const fields = (fieldDefs) =>
  Object.entries(fieldDefs).map(([name, { required, ...properties }]) =>
    defineField({
      title: startCase(name),
      type: "string",
      validation: required ? buildRequiredValidation(required) : null,
      ...properties,
      name,
    })
  )

const buildRequiredValidation = (input) =>
  typeof input === "function"
    ? (Rule) =>
        Rule.custom((value, { parent, document }) => {
          const fieldRequired = input({ value, parent, document })
          return fieldRequired && !value ? "Required" : true
        })
    : (Rule) => Rule.required()
