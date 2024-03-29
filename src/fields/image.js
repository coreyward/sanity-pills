import { defineField } from "@sanity/types"
import {
  buildImageValidator,
  getWarningValidators,
  validators,
} from "../lib/imageValidator"

export const imageField = defineField({
  type: "image",
  options: {
    accept: "image/*",
    hotspot: true,
  },
})

/**
 * Image factory params
 * @typedef {object} CreateImageParams
 * @property {string} [name]
 * @property {string | import("react").ReactElement} [description]
 * @property {import("@sanity/types").ImageOptions} [options]
 * @property {string} [fieldset]
 * @property {import("../lib/imageValidator").ImageValidationOptions} [validations]
 * @property {import("../lib/imageValidator").ImageValidationOptions} [warnings]
 */

/**
 * Creates an image field with validation
 *
 * @param {CreateImageParams} params
 * @returns {import("@sanity/types").ImageDefinition}
 */
export const createImageField = ({
  validations: { required, ...validations } = {},
  warnings = {},
  ...overrides
}) =>
  defineField({
    ...imageField,
    validation: (Rule) =>
      [
        required && Rule.required(),
        Object.keys(validations).length &&
          Rule.custom(buildImageValidator(validations, validators)),
        Object.keys(warnings).length &&
          Rule.custom(
            buildImageValidator(warnings, getWarningValidators())
          ).warning(),
      ].filter(Boolean),
    ...overrides,
  })
