import { describe, test, expect } from "vitest"
import { errors, validateUrlValue } from "./urlValidator"

describe("urlValidator", () => {
  describe("empty values", () => {
    test("empty value", () => {
      expect(validateUrlValue("")).toBe(true)
    })

    test("undefined value", () => {
      expect(validateUrlValue(undefined)).toBe(true)
    })
  })

  describe("garbage in, garbage out", () => {
    test("garbage value", () => {
      expect(() => {
        // @ts-expect-error invalid argument
        validateUrlValue(9)
      }).toThrow()
    })
  })

  describe("email links", () => {
    test("valid email link", () => {
      expect(validateUrlValue("mailto:example@gmail.com")).toBe(true)
    })

    test("invalid email link", () => {
      expect(validateUrlValue("mailto:example@gmail")).toBe(errors.invalidEmail)
    })
  })

  describe("external links", () => {
    test("https external link", () => {
      expect(validateUrlValue("https://example.com")).toBe(true)
    })

    test("http external link", () => {
      expect(validateUrlValue("http://example.com")).toBe(true)
    })

    test("invalid external link", () => {
      expect(validateUrlValue("example.com")).toBe(errors.invalidExternal)
      expect(validateUrlValue("www.example.com")).toBe(errors.invalidExternal)
    })
  })

  describe("relative links", () => {
    test("relative link", () => {
      expect(validateUrlValue("/relative")).toBe(true)
    })

    test("relative link with hash", () => {
      expect(validateUrlValue("/relative#hash")).toBe(true)
    })

    test("relative link with query", () => {
      expect(validateUrlValue("/relative?query=1")).toBe(true)
    })

    test("relative link with query and hash", () => {
      expect(validateUrlValue("/relative?query=1#hash")).toBe(true)
    })

    test("invalid relative link", () => {
      expect(validateUrlValue("relative")).toBe(errors.invalidRelative)
    })
  })

  describe("fragment links", () => {
    test("valid fragment link", () => {
      expect(validateUrlValue("#single-hash-01")).toBe(true)
    })

    test("invalid fragment link", () => {
      expect(validateUrlValue("#double#hash")).toBe(errors.invalidFragment)
    })

    test("fragment with starting number", () => {
      expect(validateUrlValue("#1hash")).toBe(errors.invalidFragment)
    })

    test("fragment with starting hyphen", () => {
      expect(validateUrlValue("#-dash")).toBe(errors.invalidFragment)
    })

    test("fragment with ending hyphen", () => {
      expect(validateUrlValue("#dash-")).toBe(errors.invalidFragment)
    })

    test("valid link with invalid fragment", () => {
      expect(validateUrlValue("https://example.com#double#hash")).toBe(
        errors.invalidFragment
      )
    })
  })

  describe("spaces", () => {
    test("external link with spaces", () => {
      expect(validateUrlValue("https://example.com/with spaces")).toBe(
        errors.invalidSpaces
      )
    })

    test("relative link with spaces", () => {
      expect(validateUrlValue("/with spaces")).toBe(errors.invalidSpaces)
    })
  })
})
