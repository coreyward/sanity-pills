import startCase from "lodash/startCase"

// Convert object-based field definition to array-based field definition
const fields = (fieldDefs) =>
  Object.entries(fieldDefs).map(([name, { required, ...properties }]) => ({
    title: startCase(name),
    type: "string",
    validation: required ? buildRequiredValidation(required) : null,
    ...properties,
    name,
  }))

export default fields

const buildRequiredValidation = (input) =>
  typeof input === "function"
    ? (Rule) =>
        Rule.custom((value, { parent, document }) => {
          const fieldRequired = input({ value, parent, document })
          return fieldRequired && !value ? "Required" : true
        })
    : (Rule) => Rule.required()
