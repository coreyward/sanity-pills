/**
 * Concatenates a list of URL parts, ensuring that there is only one slash
 * between each part.
 */
export const urlJoin = (...parts: string[]): string =>
  parts.reduce((result, part) => {
    if (!part) return result

    const trailingSlashPresent = result.endsWith("/")
    const preceedingSlashPresent = part.startsWith("/")

    return trailingSlashPresent !== preceedingSlashPresent
      ? result + part
      : trailingSlashPresent && preceedingSlashPresent
      ? result + part.substring(1)
      : result + "/" + part
  }, "" + parts.shift())
