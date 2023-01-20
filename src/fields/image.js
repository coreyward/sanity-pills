import { defineField } from "@sanity/types"
import {
  buildImageValidator,
  validators,
  warningValidators,
} from "../lib/imageValidator"

const imageField = {
  type: "image",
  options: {
    accept: "image/*",
    hotspot: true,
  },
}

export default defineField(imageField)

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
            buildImageValidator(warnings, warningValidators)
          ).warning(),
      ].filter(Boolean),
    ...overrides,
  })
