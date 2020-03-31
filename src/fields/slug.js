import urlJoin from "../lib/url-join.js"
import slugify from "slugify"

const createSlug = input =>
  slugify(input, { lower: true, remove: /[^a-zA-Z0-9 -]/g })

const slug = {
  title: "Slug",
  name: "slug",
  type: "slug",
  validation: Rule =>
    Rule.custom(
      ({ current: slug } = {}) => validateFormat(slug) || "Invalid formatting"
    ),
  options: {
    slugify: source => urlJoin("/", createSlug(source), "/"),
  },
  description:
    "The `slug` becomes the path of the published page on the website. It will be appended to the domain name automatically.",
}

export default slug

export const createSlugField = ({ prefix, ...options }) => {
  prefix = urlJoin("/", prefix, "/")

  return {
    ...slug,
    options: {
      ...slug.options,
      source: (document, opts) => {
        const obj = opts.parentPath.reduce((doc, path) => {
          if (typeof path === "object") {
            const [[property, value]] = Object.entries(path)
            return doc.find(d => d[property] === value)
          } else {
            return doc[path]
          }
        }, document)

        return obj[options.source]
      },
      slugify: source => urlJoin(prefix, createSlug(source), "/"),
    },
    validation: Rule =>
      Rule.required().custom(({ current: value } = {}) => {
        if (!value) return "Slug is required"
        if (!validateFormat(value)) return "Invalid formatting"
        if (!value.startsWith(prefix))
          return `This document type must be under ${prefix}`

        return true
      }),
  }
}

const validateFormat = slug => {
  if (!slug) return false
  switch (slug.length) {
    case 1:
      return slug === "/"

    case 2:
      return false

    case 3:
      return /\/[a-z]\//.test(slug)

    default:
      return /^\/[a-z][a-z0-9/-]*[a-z0-9]\/$/.test(slug)
  }
}
