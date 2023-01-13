import { defineArrayMember, defineField } from "@sanity/types"
import { defaultBlockValidator } from "../lib/blockValidator"

export const createBlockField = ({
  of = [],
  styles,
  marks = {},
  lists,
  required,
  ...overrides
} = {}) =>
  defineField({
    type: "array",
    of: [
      {
        type: "block",
        styles,
        marks,
        lists,
      },
      ...of,
    ].map(defineArrayMember),
    validation: required
      ? defaultBlockValidator.all
      : defaultBlockValidator.optional,
    ...overrides,
  })
