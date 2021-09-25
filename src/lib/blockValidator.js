/**
 * Validator-generator for Portable Text fields
 *
 * @param {Object} options
 * @param {Boolean} options.required Require a value to be set in this field?
 * @param {Boolean} options.noEmptyBlocks Prevent zero-length blocks?
 * @param {Boolean} options.validateLinks Ensure links have required attributes?
 * @param {Boolean} options.styleRequired Ensure blocks have an associated style?
 * @param {Boolean} options.noStackedMarks Disallow stacked standard marks (e.g. bold + italic), but allow custom marks to stack
 * @param {Boolean} options.noNewlines Prevent newlines inside of block content
 * @param {Boolean} options.noTerminatingWhitespace Prevent preceding or trailing whitespace
 */
export const createBlockValidator = (options) => {
  const { required, ...customValidators } = options

  return (Rule) =>
    [
      required && Rule.required(),
      ...Object.entries(customValidators)
        .filter(([, value]) => value)
        .map(([name, value]) =>
          Rule.custom(
            typeof value === "boolean" ? blockValidations[name] : value
          )
        ),
    ].filter(Boolean)
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
  }),

  optional: createBlockValidator({
    noEmptyBlocks: true,
    noStackedMarks: true,
    styleRequired: true,
    validateLinks: true,
    noNewlines: true,
    noTerminatingWhitespace: true,
  }),
}

export const blockValidations = {
  // https://www.sanity.io/docs/validation#validating-children-9e69d5db6f72
  noEmptyBlocks: (blocks) => {
    const offendingPaths = (blocks || [])
      .filter(
        (block) =>
          block._type === "block" &&
          block.children.every(
            (span) => span._type === "span" && span.text.trim() === ""
          )
      )
      .map((block, index) => [{ _key: block._key }] || [index])

    return (
      offendingPaths.length === 0 || {
        message: "Paragraph cannot be empty",
        paths: offendingPaths,
      }
    )
  },

  // Prevent newlines inside of block content
  noNewlines: (blocks) => {
    const offendingPaths = (blocks || [])
      .filter(
        (block) =>
          block._type === "block" &&
          block.children.every(
            (span) => span._type === "span" && span.text.includes("\n")
          )
      )
      .map((block, index) => [{ _key: block._key }] || [index])

    return (
      offendingPaths.length === 0 || {
        message: "Text cannot contain arbitrary newlines",
        paths: offendingPaths,
      }
    )
  },

  // Prevent preceding or trailing whitespace
  noTerminatingWhitespace: (blocks) => {
    const offendingPaths = (blocks || [])
      .filter(
        (block) =>
          block._type === "block" &&
          block.children.every(
            (span) => span._type === "span" && span.text !== span.text.trim()
          )
      )
      .map((block, index) => [{ _key: block._key }] || [index])

    return (
      offendingPaths.length === 0 || {
        message: "Blocks cannot start or end with whitespace",
        paths: offendingPaths,
      }
    )
  },

  // Links without href attributes
  validateLinks: (blocks) => {
    const errorPaths = (blocks || [])
      .filter(
        (block) =>
          block._type === "block" &&
          block.markDefs.some(
            (def) =>
              def._type === "link" && !(def.href && def.href.trim() !== "")
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
    const emptyPaths = (blocks || [])
      .filter((block) => block._type === "block" && !block.style)
      .map((block, index) => [{ _key: block._key }] || [index])

    return (
      emptyPaths.length === 0 || {
        message: "Must have a style selected",
        paths: emptyPaths,
      }
    )
  },

  // Disallow stacked standard marks (e.g. bold + italic), but allow custom marks to stack
  noStackedMarks: (blocks) => {
    const errorPaths = (blocks || [])
      .filter(
        (block) =>
          block._type === "block" &&
          block.children.some(
            (span) =>
              span.marks.filter((mark) => standardMarks.includes(mark)).length >
              1
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
}

const standardMarks = ["strong", "em", "underline", "del", "code"]
