import decodeAssetId from "./decodeAssetId"

export const buildImageValidator =
  (validations, selectedValidators) => (image) => {
    if (image && image.asset && image.asset._ref) {
      const { dimensions, format } = decodeAssetId(image.asset._ref)

      const validatorProps = {
        ...validations,
        ...dimensions,
        format,
      }

      for (const validation in validations) {
        if (!selectedValidators[validation]) {
          throw new Error(`Unexpected validation \`${validation}\` specified.`)
        }

        const result = selectedValidators[validation](validatorProps)
        if (typeof result === "string") return result
      }
    }

    return true
  }

export const validators = {
  minWidth: ({ minWidth, width, format }) =>
    format === "svg" ||
    width >= minWidth ||
    `Image must be at least ${minWidth}px wide`,
  minHeight: ({ minHeight, height, format }) =>
    format === "svg" ||
    height >= minHeight ||
    `Image must be at least ${minHeight}px tall`,
  maxWidth: ({ maxWidth, width }) =>
    width <= maxWidth || `Image must be less than ${maxWidth}px wide`,
  maxHeight: ({ maxHeight, height }) =>
    height <= maxHeight || `Image must be less than ${maxHeight}px tall`,
  allowedFormats: ({ allowedFormats, format }) =>
    allowedFormats.includes(format) ||
    `Image must be in ${allowedFormats.join(" or ")} format`,
}

export const warningValidators = Object.entries(validators).reduce(
  (out, [name, fn]) => {
    out[name] = (props) =>
      typeof fn(props) === "string"
        ? fn(props).replace("must", "should") + " for best results"
        : true
    return out
  },
  {}
)
