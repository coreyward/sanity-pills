import decodeAssetId from "../lib/decode-asset-id"

const imageField = {
  title: "Image",
  name: "image",
  type: "image",
  options: {
    accept: "image/*",
    hotspot: true,
  },
}

export default imageField

export const createImageField = ({
  validations: { required, ...validations } = {},
  ...overrides
}) => ({
  ...imageField,
  validation: Rule =>
    [
      required && Rule.required(),
      Object.keys(validations).length &&
        Rule.custom(buildImageValidator(validations)),
    ].filter(x => x),
  ...overrides,
})

const buildImageValidator = validations => image => {
  if (image && image.asset && image.asset._ref) {
    const { dimensions } = decodeAssetId(image.asset._ref)

    const validatorProps = {
      ...validations,
      ...dimensions,
    }

    for (const validation in validations) {
      if (!validators.hasOwnProperty(validation)) {
        throw new Error(`Unexpected validation \`${validation}\` specified.`)
      }

      const result = validators[validation](validatorProps)
      if (typeof result === "string") return result
    }
  }

  return true
}

const validators = {
  minWidth: ({ minWidth, width }) =>
    width >= minWidth || `Image must be at least ${minWidth}px wide`,
  minHeight: ({ minHeight, height }) =>
    height >= minHeight || `Image must be at least ${minHeight}px tall`,
  maxWidth: ({ maxWidth, width }) =>
    width <= maxWidth || `Image must be less than ${maxWidth}px wide`,
  maxHeight: ({ maxHeight, height }) =>
    height <= maxHeight || `Image must be less than ${maxHeight}px tall`,
}
