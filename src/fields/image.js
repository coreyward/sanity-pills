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

export default imageField

export const createImageField = ({
  validations: { required, ...validations } = {},
  warnings = {},
  ...overrides
}) => ({
  ...imageField,
  validation: (Rule) =>
    [
      required && Rule.required(),
      Object.keys(validations).length &&
        Rule.custom(buildImageValidator(validations, validators)),
      Object.keys(warnings).length &&
        Rule.custom(buildImageValidator(warnings, warningValidators)).warning(),
    ].filter(Boolean),
  ...overrides,
})
