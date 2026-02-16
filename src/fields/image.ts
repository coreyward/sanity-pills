import type { ImageOptions, ImageValue, Rule } from "@sanity/types"
import {
  type ImageValidationOptions,
  buildImageValidator,
  getWarningValidators,
  validators,
} from "../lib/imageValidator"
import type { FieldDef } from "../lib/fieldsHelper"

export const imageField: FieldDef = {
  type: "image",
  options: {
    accept: "image/*",
    hotspot: true,
  },
}

type CreateImageParams = {
  name?: string
  description?: string | React.ReactElement
  options?: ImageOptions
  fieldset?: string
  validations?: ImageValidationOptions
  warnings?: ImageValidationOptions
}

/**
 * Creates an image field with validation
 */
export const createImageField = ({
  validations: { required, ...validations } = {},
  warnings = {},
  ...overrides
}: CreateImageParams): FieldDef => ({
  ...imageField,
  validation: (rule: Rule) =>
    [
      required && rule.required(),
      Object.keys(validations).length > 0 &&
        rule.custom<ImageValue | undefined>(
          buildImageValidator(validations, validators)
        ),
      Object.keys(warnings).length > 0 &&
        rule
          .custom(buildImageValidator(warnings, getWarningValidators()))
          .warning(),
    ].filter(Boolean),
  ...overrides,
})
