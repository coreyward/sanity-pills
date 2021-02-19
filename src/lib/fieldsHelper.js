import startCase from "lodash/startCase"

// Convert object-based field definition to array-based field definition
const fields = (fieldDefs) =>
  Object.entries(fieldDefs).map(([name, { required, ...properties }]) => ({
    title: startCase(name),
    type: "string",
    validation: required ? (Rule) => Rule.required() : null,
    ...properties,
    name,
  }))

export default fields
