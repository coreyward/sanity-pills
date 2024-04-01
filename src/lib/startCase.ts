/**
 * Converts a string in camelCase, snake_case, or kebab-case to Start Case.
 *
 * @param {string} input
 * @returns {string}
 */
export const startCase = (input: string) => {
  const parts = isCamelCase(input)
    ? splitCamelCase(input)
    : splitDelimited(input)

  return (parts ?? [input])
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/**
 * Evaluate whether input is camelCase.
 */
export const isCamelCase = (input: string) =>
  /^[A-Za-z][\da-z]*[A-Z][\dA-Za-z]+$/.test(input)

/**
 * Split camelCase on capital letters following lowercase
 */
export const splitCamelCase = (input: string) =>
  input.match(/(^[A-Za-z][\da-z]+|(?<=[a-z])([A-Z]+[\da-z]*))/g)

/**
 * Split on hyphens, underscores, and spaces
 */
export const splitDelimited = (input: string) =>
  input
    .replace(/[-_\s]+/g, " ")
    .trim()
    .split(" ")
