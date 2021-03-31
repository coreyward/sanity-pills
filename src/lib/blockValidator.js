/**
 * Validator-generator for Portable Text fields
 *
 * @param {Object} options
 * @param {Boolean} options.required Require a value to be set in this field?
 * @param {Boolean} options.noEmptyBlocks Prevent zero-length blocks?
 * @param {Boolean} options.validateLinks Ensure links have required attributes?
 * @param {Boolean} options.styleRequired Ensure blocks have an associated style?
 */
export const blockValidator = (options) => {
  const { required, ...customValidators } = options

  return (Rule) =>
    [
      required && Rule.required(),
      ...Object.entries(customValidators)
        .filter(([, value]) => value)
        .map(([name]) => Rule.custom(validators[name])),
    ].filter(Boolean)
}

const blockValidators = {
  all: blockValidator({
    required: true,
    noEmptyBlocks: true,
    noStackedMarks: true,
    styleRequired: true,
    validateLinks: true,
  }),

  optional: blockValidator({
    noEmptyBlocks: true,
    noStackedMarks: true,
    styleRequired: true,
    validateLinks: true,
  }),

  formatOnly: blockValidator({
    styleRequired: true,
    validateLinks: true,
    noStackedMarks: true,
  }),
}

export default blockValidators

const validators = {
  // https://www.sanity.io/docs/validation#validating-children-9e69d5db6f72
  noEmptyBlocks: (blocks) => {
    const emptyBlocks = (blocks || []).filter(
      (block) =>
        block._type === "block" &&
        block.children.every(
          (span) => span._type === "span" && span.text.trim() === ""
        )
    )

    const emptyPaths = emptyBlocks.map(
      (block, index) => [{ _key: block._key }] || [index]
    )

    return (
      emptyPaths.length === 0 || {
        message: "Paragraph cannot be empty",
        paths: emptyPaths,
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
