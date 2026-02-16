import type {
  BlockRule,
  CustomValidatorResult,
  PortableTextBlock,
  PortableTextSpan,
  PortableTextTextBlock,
  ValidationBuilder,
} from "@sanity/types"

type BlockValidatorOptions = {
  /**
   * Require a value to be set in this field?
   */
  required?: boolean
  /**
   * Prevent zero-length blocks?
   */
  noEmptyBlocks?: boolean
  /**
   * Ensure links have required attributes?
   */
  validateLinks?: boolean
  /**
   * Ensure blocks have an associated style?
   */
  styleRequired?: boolean
  /**
   * Disallow stacked standard marks (e.g. bold + italic), but allow custom marks to stack
   */
  noStackedMarks?: boolean
  /**
   * Prevent newlines inside of block content
   */
  noNewlines?: boolean
  /**
   * Prevent preceding or trailing whitespace
   */
  noTerminatingWhitespace?: boolean
  /**
   * Headings cannot have marks applied (e.g. bold, links, etc.)
   */
  noMarksOnHeadings?: boolean
}

type BlockValidator = (
  blocks: PortableTextBlock[] | undefined
) => CustomValidatorResult

const isTextBlock = (
  block: PortableTextBlock
): block is PortableTextTextBlock => block._type === "block"

const isSpan = (
  child: PortableTextSpan | { _type: string; [k: string]: unknown }
): child is PortableTextSpan => child._type === "span"

/**
 * Validator-generator for Portable Text fields
 */
export const createBlockValidator = (
  options: BlockValidatorOptions
): ValidationBuilder<BlockRule, PortableTextBlock[]> => {
  const { required, ...customValidators } = options

  return (rule) => {
    const rules = Object.entries(customValidators)
      .filter(([, value]) => value)
      .map(([name]) =>
        rule.custom(blockValidations[name as keyof typeof blockValidations])
      )

    if (required) {
      rules.unshift(rule.required())
    }

    return rules
  }
}

export const defaultBlockValidator = {
  all: createBlockValidator({
    required: true,
    noEmptyBlocks: true,
    noStackedMarks: true,
    styleRequired: true,
    validateLinks: true,
    noNewlines: true,
    noTerminatingWhitespace: true,
    noMarksOnHeadings: true,
  }),

  optional: createBlockValidator({
    noEmptyBlocks: true,
    noStackedMarks: true,
    styleRequired: true,
    validateLinks: true,
    noNewlines: true,
    noTerminatingWhitespace: true,
    noMarksOnHeadings: true,
  }),
}

export const blockValidations: Record<
  keyof Omit<BlockValidatorOptions, "required">,
  BlockValidator
> = {
  // https://www.sanity.io/docs/validation#validating-children-9e69d5db6f72
  noEmptyBlocks: (blocks) => {
    const offendingPaths = (blocks ?? [])
      .filter(
        (block) =>
          isTextBlock(block) &&
          block.children.every(
            (span) => isSpan(span) && span.text.trim() === ""
          )
      )
      .map((block) => [{ _key: block._key }])

    return (
      offendingPaths.length === 0 || {
        message: "Paragraph cannot be empty",
        paths: offendingPaths,
      }
    )
  },

  // Prevent newlines inside of block content
  noNewlines: (blocks) => {
    const offendingPaths = (blocks ?? [])
      .filter(
        (block) =>
          isTextBlock(block) &&
          !block.level &&
          block.children.some(
            (span) => isSpan(span) && span.text.includes("\n")
          )
      )
      .map((block) => [{ _key: block._key }])

    return (
      offendingPaths.length === 0 || {
        message: "Text cannot contain arbitrary newlines",
        paths: offendingPaths,
      }
    )
  },

  // Prevent preceding or trailing whitespace
  noTerminatingWhitespace: (blocks) => {
    const offendingPaths = (blocks ?? [])
      .filter((block) => {
        if (!isTextBlock(block)) {
          return false
        }

        const spans = block.children.filter(isSpan)
        const first = spans[0]
        const last = spans[spans.length - 1]

        const startsWithSpace = first?.text.startsWith(" ") === true
        const endsWithSpace = last?.text.endsWith(" ") === true

        return startsWithSpace || endsWithSpace
      })
      .map((block) => [{ _key: block._key }])

    return (
      offendingPaths.length === 0 || {
        message: "Blocks cannot start or end with whitespace",
        paths: offendingPaths,
      }
    )
  },

  // Links without href attributes
  validateLinks: (blocks) => {
    const errorPaths = (blocks ?? [])
      .filter(
        (block) =>
          isTextBlock(block) &&
          (block.markDefs ?? []).some(
            (def) =>
              def._type === "link" &&
              !(
                "href" in def &&
                typeof def.href === "string" &&
                def.href.trim() !== ""
              )
          )
      )
      .map((block) => [{ _key: block._key }])

    return (
      errorPaths.length === 0 || {
        message: "Links must have a url set",
        paths: errorPaths,
      }
    )
  },

  // Ensure all blocks have a `style`
  styleRequired: (blocks) => {
    const emptyPaths = (blocks ?? [])
      .filter((block) => isTextBlock(block) && !block.style)
      .map((block) => [{ _key: block._key }])

    return (
      emptyPaths.length === 0 || {
        message: "Must have a style selected",
        paths: emptyPaths,
      }
    )
  },

  // Disallow stacked standard marks (e.g. bold + italic), but allow custom marks to stack
  noStackedMarks: (blocks) => {
    const errorPaths = (blocks ?? [])
      .filter(
        (block) =>
          isTextBlock(block) &&
          block.children.some(
            (span) =>
              isSpan(span) &&
              (span.marks ?? []).filter((mark) => standardMarks.includes(mark))
                .length > 1
          )
      )
      .map((block) => [{ _key: block._key }])

    return (
      errorPaths.length === 0 || {
        message:
          "Text cannot have multiple marks applied (e.g. bold and italic)",
        paths: errorPaths,
      }
    )
  },

  noMarksOnHeadings: (blocks) => {
    const errorPaths = (blocks ?? [])
      .filter(
        (block) =>
          isTextBlock(block) &&
          block.style?.startsWith("h") &&
          block.children.some(
            (span) => isSpan(span) && (span.marks ?? []).length > 0
          )
      )
      .map((block) => [{ _key: block._key }])

    return (
      errorPaths.length === 0 || {
        message: "Headings cannot have marks applied (e.g. bold, links, etc.)",
        paths: errorPaths,
      }
    )
  },
}

const standardMarks = ["strong", "em", "underline", "del", "code"]
