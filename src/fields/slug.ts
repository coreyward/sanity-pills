import slugify from "slugify"
import {
  defineField,
  type SlugDefinition,
  type SlugOptions,
  type SlugRule,
  type SlugValue,
} from "@sanity/types"
import { urlJoin } from "../lib/urlJoin"

/**
 * Create a url-friendly slug with a limited character set.
 */
export const createSlug = (input: string): string =>
  slugify(input, { lower: true, remove: /[^a-zA-Z0-9 -]/g })

export const slugField = defineField({
  title: "Slug",
  name: "slug",
  type: "slug",
  validation: (Rule) =>
    Rule.custom(
      (value) => validateFormat(value?.current) || "Invalid formatting"
    ),
  options: {
    slugify: (source: string) => urlJoin("/", createSlug(source), "/"),
  },
  description:
    "The `slug` becomes the path of the published page on the website. It will be appended to the domain name automatically.",
})

type CreateSlugFieldOptions = Omit<
  Partial<SlugDefinition>,
  "type" | "validation"
> &
  Omit<SlugOptions, "slugify"> & {
    prefix?: string
    validation?: (rule: SlugRule) => SlugRule
  }

export const createSlugField = ({
  prefix: rawPrefix,
  validation,
  source,
  maxLength,
  isUnique,
  disableArrayWarning,
  ...rest
}: CreateSlugFieldOptions) => {
  const prefix = urlJoin("/", rawPrefix ?? "", "/")

  return defineField({
    ...slugField,
    ...rest,
    options: {
      ...slugField.options,
      slugify: (input: string) => urlJoin(prefix, createSlug(input), "/"),
      ...(source != null && { source }),
      ...(maxLength != null && { maxLength }),
      ...(isUnique != null && { isUnique }),
      ...(disableArrayWarning != null && { disableArrayWarning }),
    },
    validation: (Rule) =>
      [
        Rule.required().custom((value: SlugValue | undefined) => {
          if (!value?.current) {
            return "Slug is required"
          }
          if (!validateFormat(value.current)) {
            return "Invalid formatting"
          }
          if (!value.current.startsWith(prefix)) {
            return `This document type must be under ${prefix}`
          }

          return true
        }),
        validation?.(Rule),
      ].filter(Boolean) as SlugRule[],
  })
}

const validateFormat = (slug: string | undefined): boolean => {
  if (!slug) {
    return false
  }
  switch (slug.length) {
    case 1:
      return slug === "/"

    case 2:
      return false

    case 3:
      return /\/[a-z]\//.test(slug)

    default:
      return /^\/([a-z][a-z0-9/-]*[a-z0-9]|404)\/$/.test(slug)
  }
}
