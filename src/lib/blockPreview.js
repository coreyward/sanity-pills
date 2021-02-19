// Reduces a portable text field to a string for
// use in Studio previews.
export default (content) => {
  if (!Array.isArray(content) || content.length === 0) return null

  return content.reduce(
    (text, { _type, children }) =>
      _type === "block"
        ? text +
          children
            .filter((child) => child._type === "span")
            .map((span) => span.text)
            .join("")
        : text,
    ""
  )
}
