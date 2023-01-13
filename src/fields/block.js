import { defineArrayMember, defineField } from "@sanity/types"
import { defaultBlockValidator } from "../lib/blockValidator"

/**
 * Sanity Marks type
 * @typedef {object} Marks
 * @property {object[]} [annotations] Annotation types
 * @property {object[]} [decorators] Decorators
 */

/**
 * Sanity list entry type
 * @typedef {object} ListEntry
 * @property {string} title Title
 * @property {string} value Value
 */

/**
 * Create a block-type Sanity field with validation
 * @param {object} [options]
 * @param {object[]} [options.of] Array of additional field types to allow in the block
 * @param {ListEntry[]} [options.styles] Styles
 * @param {Marks} [options.marks] Mark types
 * @param {object} [options.lists] List types
 * @param {boolean} [options.required] Whether the field is required
 * @param {string} [options.name] Field name
 * @param {string} [options.title] Field title
 * @param {string} [options.description] Field description
 * @param {string} [options.fieldset] Fieldset to show in
 */
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
