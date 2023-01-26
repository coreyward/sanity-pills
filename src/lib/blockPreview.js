/**
 * Reduces a portable text field to a string for use in Studio previews.
 *
 * @param {object[]} [content] Portable Text content
 * @returns {string} Text content
 */
export const blockPreview = (content) => {
  if (!Array.isArray(content) || content.length === 0) return null

  return content.reduce(
    (text, { _type, children }) =>
      _type === "block"
        ? text +
          " " +
          children
            .filter((child) => child._type === "span")
            .map((span) => span.text)
            .join("")
        : text,
    ""
  )
}
