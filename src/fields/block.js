import { defaultBlockValidator } from "../lib/blockValidator"

export const createBlockField = ({
  of = [],
  styles,
  marks = {},
  lists,
  required,
  ...overrides
}) => ({
  type: "array",
  of: [
    {
      type: "block",
      styles,
      marks,
      lists,
    },
    ...of,
  ],
  validation: required
    ? defaultBlockValidator.all
    : defaultBlockValidator.optional,
  ...overrides,
})
