import slugify from "slugify"
import { urlJoin } from "../lib/urlJoin.js"
import { defineField } from "@sanity/types"

/**
 * Create a url-friendly slug with a limited character set.
 *
 * @param {string} input
 */
export const createSlug = (input) =>
  slugify(input, { lower: true, remove: /[^a-zA-Z0-9 -]/g })

export const slugField = defineField({
  title: "Slug",
  name: "slug",
  type: "slug",
  validation: (Rule) =>
    Rule.custom(
      ({ current: slug } = {}) => validateFormat(slug) || "Invalid formatting"
    ),
  options: {
    slugify: (source) => urlJoin("/", createSlug(source), "/"),
  },
  description:
    "The `slug` becomes the path of the published page on the website. It will be appended to the domain name automatically.",
})

/**
 * Generate a slug-type Sanity field with validation
 *
 * @param {object} options
 * @param {string} options.source - Name of the document field to use as a source for the slug generator
 * @param {string} [options.prefix] - Require the slug to begin with a specific path
 * @param {string} [options.name] - Name of the slug field
 * @param {string} [options.title] - Title of the slug field
 * @param {function} [options.slugify] - Slugging function
 * @param {function} [options.validation] - Validation function
 * @returns {object} Sanity field definition
 */
export const createSlugField = ({ prefix, validation, ...options }) => {
  prefix = urlJoin("/", prefix, "/")

  return defineField({
    ...slugField,
    options: {
      ...slugField.options,

      slugify: (source) => urlJoin(prefix, createSlug(source), "/"),

      ...options,
    },
    validation: (Rule) =>
      [
        Rule.required().custom(({ current: value } = {}) => {
          if (!value) return "Slug is required"
          if (!validateFormat(value)) return "Invalid formatting"
          if (!value.startsWith(prefix))
            return `This document type must be under ${prefix}`

          return true
        }),
        validation && validation(Rule),
      ].filter(Boolean),
  })
}

const validateFormat = (slug) => {
  if (!slug) return false
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
