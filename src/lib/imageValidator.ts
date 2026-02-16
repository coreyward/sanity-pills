import type {
  CustomValidator,
  ImageValue,
} from "@sanity/types"
import { decodeAssetId } from "./decodeAssetId"

export type ImageValidationOptions = {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  /**
   * Allowed file extensions (no separator)
   */
  allowedFormats?: string[]
  required?: boolean
}

export const buildImageValidator =
  (
    validations: ImageValidationOptions,
    selectedValidators: Record<
      keyof typeof validators,
      (typeof validators)[keyof typeof validators]
    >
  ): CustomValidator<ImageValue | undefined> =>
  (image) => {
    if (image?.asset?._ref) {
      const { dimensions, format } = decodeAssetId(image.asset._ref)

      const validatorProps = {
        ...validations,
        ...dimensions,
        format,
      }

      for (const validation in validations) {
        const validationKey = validation as keyof typeof validators
        if (!(validationKey in selectedValidators)) {
          throw new Error(`Unexpected validation \`${validation}\` specified.`)
        }

        const result = selectedValidators[validationKey](validatorProps as never)
        if (typeof result === "string") {
          return result
        }
      }
    }

    return true
  }

export const validators = {
  minWidth: ({
    minWidth,
    width,
    format,
  }: {
    minWidth: number
    width: number
    format: string
  }) =>
    format === "svg" ||
    width >= minWidth ||
    `Image must be at least ${minWidth}px wide`,
  minHeight: ({
    minHeight,
    height,
    format,
  }: {
    minHeight: number
    height: number
    format: string
  }) =>
    format === "svg" ||
    height >= minHeight ||
    `Image must be at least ${minHeight}px tall`,
  maxWidth: ({ maxWidth, width }: { maxWidth: number; width: number }) =>
    width <= maxWidth || `Image must be less than ${maxWidth}px wide`,
  maxHeight: ({ maxHeight, height }: { maxHeight: number; height: number }) =>
    height <= maxHeight || `Image must be less than ${maxHeight}px tall`,
  allowedFormats: ({
    allowedFormats,
    format,
  }: {
    allowedFormats: string[]
    format: string
  }) =>
    allowedFormats.includes(format) ||
    `Image must be in ${allowedFormats.join(" or ")} format`,
} as const

let warningValidators: typeof validators | undefined
export const getWarningValidators = () =>
  warningValidators ?? (warningValidators = createWarningValidators())

const createWarningValidators = (): typeof validators => {
  const result = {} as Record<string, unknown>
  
  for (const [name, fn] of Object.entries(validators)) {
    const key = name as keyof typeof validators
    result[key] = (props: Parameters<typeof fn>[0]) => {
      const validationResult = fn(props as never)
      return typeof validationResult === "string"
        ? validationResult.replace("must", "should") + " for best results"
        : true
    }
  }
  
  return result as typeof validators
}
