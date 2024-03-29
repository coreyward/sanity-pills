import { decodeAssetId } from "./decodeAssetId"

/**
 * Validation options for image fields
 * @typedef {object} ImageValidationOptions
 * @property {number} [minWidth] Minimum width in pixels
 * @property {number} [minHeight] Minimum height in pixels
 * @property {number} [maxWidth] Maximum width in pixels
 * @property {number} [maxHeight] Maximum height in pixels
 * @property {string[]} [allowedFormats] Allowed file extensions (no separator)
 * @property {boolean} [required] Whether the field is required
 */

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

let warningValidators
export const getWarningValidators = () =>
  warningValidators || (warningValidators = createWarningValidators())

const createWarningValidators = () =>
  Object.entries(validators).reduce((out, [name, fn]) => {
    out[name] = (props) =>
      typeof fn(props) === "string"
        ? fn(props).replace("must", "should") + " for best results"
        : true
    return out
  }, {})
