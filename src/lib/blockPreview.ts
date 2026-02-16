import type { PortableTextBlock, PortableTextSpan } from "@sanity/types"

/**
 * Reduces a portable text field to a string for use in Studio previews.
 *
 * @param {object[]} [content] Portable Text content
 * @returns {string} Text content
 */
export const blockPreview = (
  content: PortableTextBlock[] | undefined
): string | null => {
  if (!Array.isArray(content) || content.length === 0) {
    return null
  }

  return content
    .reduce(
      (text, { _type, children }) =>
        _type === "block" ? text + " " + childrenToString(children) : text,
      ""
    )
    .trim()
}

const isPortableTextSpan = (val: unknown): val is PortableTextSpan => {
  if (!val || typeof val !== "object") {
    return false
  }
  const v = val as Record<string, unknown>
  return (
    typeof v._type === "string" &&
    v._type === "span" &&
    typeof v.text === "string"
  )
}

export const childrenToString = (children: unknown) => {
  if (!Array.isArray(children)) {
    return ""
  }

  const items: unknown[] = children

  return items
    .filter(isPortableTextSpan)
    .map((span) => span.text)
    .join("")
}
