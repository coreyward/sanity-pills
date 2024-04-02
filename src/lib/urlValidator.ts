import type { Rule } from "@sanity/types"

/**
 * Regular expression pattern matching email addresses designed to catch input
 * errors and mistakes more than to prevent all invalid emails.
 */
export const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * Regular expression matching common URL fragments
 */
export const fragmentPattern = /^[^#]*#([a-z][a-z0-9-]*[a-z0-9]|[a-z0-9])$/i

export const errors = {
  invalidEmail: "Email address seems invalid.",
  invalidExternal:
    "External links need to start with `https://` (e.g., `https://www.example.com/`)",
  invalidRelative:
    "Relative links should start with a forward slash (/) or fragment (#).",
  invalidSpaces: "Links cannot contain unencoded spaces.",
  invalidFragment: "The fragment portion of this link looks invalid.",
} as const

/**
 * Validates a provided string value as a URL. Expected to be used in
 * conjunction with the built in `uri` validator in the Sanity Studio.
 */
export const validateUrlValue = (value: string) => {
  if (value?.startsWith("mailto:")) {
    const [, emailPart] = value.split(":")
    if (!emailPattern.test(emailPart)) {
      return errors.invalidEmail
    } else {
      return true
    }
  }

  // Custom handling of external-looking links without a protocol
  if (
    value &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    (value.startsWith("www.") || value.includes(".com"))
  ) {
    return errors.invalidExternal
  }

  if (
    value &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.startsWith("/") &&
    !value.startsWith("#")
  ) {
    return errors.invalidRelative
  }

  if (value?.includes(" ")) {
    return errors.invalidSpaces
  }

  if (value?.includes("#") && !fragmentPattern.test(value)) {
    return errors.invalidFragment
  }

  return true
}

/**
 * Validates a required URL field value
 */
export const requiredUrlValidator = (rule: Rule) =>
  rule
    .required()
    .uri({
      allowRelative: true,
      scheme: ["https", "http", "mailto"],
    })
    .custom(validateUrlValue)

/**
 * Validates a URL field value without requiring it to be present.
 */
export const optionalUrlValidator = (rule: Rule) =>
  rule
    .uri({
      allowRelative: true,
      scheme: ["https", "http", "mailto"],
    })
    .custom(validateUrlValue)
