/* eslint-disable @typescript-eslint/unbound-method */
import { describe, expect, test, vi } from "vitest"
import type {
  PortableTextBlock,
  PortableTextTextBlock,
  Rule,
} from "@sanity/types"
import { blockValidations, createBlockValidator } from "./blockValidator"

const span = (
  text: string,
  marks: string[] = []
): PortableTextTextBlock["children"][number] => ({
  _type: "span",
  _key: "s1",
  text,
  marks,
})

const block = (
  overrides: Partial<PortableTextTextBlock> = {}
): PortableTextTextBlock => ({
  _type: "block",
  _key: "b1",
  style: "normal",
  children: [span("Hello world")],
  markDefs: [],
  ...overrides,
})

const customBlock = (type: string): PortableTextBlock => ({
  _type: type,
  _key: "c1",
})

const mockRule = () => {
  const rule = {
    required: vi.fn(() => rule),
    custom: vi.fn(() => rule),
  } as unknown as Rule
  return rule
}

describe("createBlockValidator", () => {
  test("returns a function", () => {
    const validator = createBlockValidator({})
    expect(typeof validator).toBe("function")
  })

  test("calls rule.required when required is true", () => {
    const validator = createBlockValidator({ required: true })
    const rule = mockRule()
    validator(rule)
    expect(rule.required).toHaveBeenCalledOnce()
  })

  test("does not call rule.required when required is false or omitted", () => {
    const validator = createBlockValidator({ noEmptyBlocks: true })
    const rule = mockRule()
    validator(rule)
    expect(rule.required).not.toHaveBeenCalled()
  })

  test("calls rule.custom for each enabled validator", () => {
    const validator = createBlockValidator({
      noEmptyBlocks: true,
      noNewlines: true,
      validateLinks: true,
    })
    const rule = mockRule()
    validator(rule)
    expect(rule.custom).toHaveBeenCalledTimes(3)
  })

  test("skips disabled validators", () => {
    const validator = createBlockValidator({
      noEmptyBlocks: true,
      noNewlines: false,
      validateLinks: true,
    })
    const rule = mockRule()
    validator(rule)
    expect(rule.custom).toHaveBeenCalledTimes(2)
  })

  test("passes the correct validator function to rule.custom", () => {
    const validator = createBlockValidator({ noEmptyBlocks: true })
    const rule = mockRule()
    validator(rule)
    expect(rule.custom).toHaveBeenCalledWith(blockValidations.noEmptyBlocks)
  })

  test("returns an array of rules", () => {
    const validator = createBlockValidator({
      required: true,
      noEmptyBlocks: true,
    })
    const rule = mockRule()
    const result = validator(rule)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
  })

  test("returns empty array when no options are enabled", () => {
    const validator = createBlockValidator({})
    const rule = mockRule()
    const result = validator(rule)
    expect(result).toEqual([])
  })
})

describe("noEmptyBlocks", () => {
  const validate = blockValidations.noEmptyBlocks

  test("passes for blocks with text", () => {
    expect(validate([block()])).toBe(true)
  })

  test("fails for blocks with only whitespace spans", () => {
    const result = validate([block({ children: [span("  ")] })])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty("message", "Paragraph cannot be empty")
  })

  test("fails for blocks with empty text", () => {
    const result = validate([block({ children: [span("")] })])
    expect(result).not.toBe(true)
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })

  test("ignores non-block types", () => {
    expect(validate([customBlock("image")])).toBe(true)
  })
})

describe("noNewlines", () => {
  const validate = blockValidations.noNewlines

  test("passes for text without newlines", () => {
    expect(validate([block()])).toBe(true)
  })

  test("fails for text with newlines", () => {
    const result = validate([block({ children: [span("line1\nline2")] })])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty(
      "message",
      "Text cannot contain arbitrary newlines"
    )
  })

  test("allows newlines in list items", () => {
    expect(
      validate([block({ level: 1, children: [span("line1\nline2")] })])
    ).toBe(true)
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })
})

describe("noTerminatingWhitespace", () => {
  const validate = blockValidations.noTerminatingWhitespace

  test("passes for normal text", () => {
    expect(validate([block()])).toBe(true)
  })

  test("fails for leading whitespace", () => {
    const result = validate([block({ children: [span(" Hello")] })])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty(
      "message",
      "Blocks cannot start or end with whitespace"
    )
  })

  test("fails for trailing whitespace", () => {
    const result = validate([block({ children: [span("Hello ")] })])
    expect(result).not.toBe(true)
  })

  test("passes when text has no boundary whitespace", () => {
    expect(
      validate([block({ children: [span("Hello"), span("world")] })])
    ).toBe(true)
  })

  test("checks first and last spans only", () => {
    const result = validate([
      block({ children: [span("Hello"), span(" middle "), span("world ")] }),
    ])
    expect(result).not.toBe(true)
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })
})

describe("validateLinks", () => {
  const validate = blockValidations.validateLinks

  test("passes when links have href", () => {
    expect(
      validate([
        block({
          markDefs: [
            { _type: "link", _key: "l1", href: "https://example.com" },
          ],
        }),
      ])
    ).toBe(true)
  })

  test("fails when link has no href", () => {
    const result = validate([
      block({ markDefs: [{ _type: "link", _key: "l1" }] }),
    ])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty("message", "Links must have a url set")
  })

  test("fails when link has empty href", () => {
    const result = validate([
      block({ markDefs: [{ _type: "link", _key: "l1", href: "" }] }),
    ])
    expect(result).not.toBe(true)
  })

  test("fails when link has whitespace-only href", () => {
    const result = validate([
      block({ markDefs: [{ _type: "link", _key: "l1", href: "  " }] }),
    ])
    expect(result).not.toBe(true)
  })

  test("ignores non-link mark defs", () => {
    expect(
      validate([block({ markDefs: [{ _type: "highlight", _key: "h1" }] })])
    ).toBe(true)
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })
})

describe("styleRequired", () => {
  const validate = blockValidations.styleRequired

  test("passes when style is set", () => {
    expect(validate([block({ style: "normal" })])).toBe(true)
  })

  test("fails when style is missing", () => {
    const { style: _, ...noStyle } = block()
    const result = validate([noStyle as PortableTextTextBlock])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty("message", "Must have a style selected")
  })

  test("passes for non-block types", () => {
    expect(validate([customBlock("image")])).toBe(true)
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })
})

describe("noStackedMarks", () => {
  const validate = blockValidations.noStackedMarks

  test("passes with a single standard mark", () => {
    expect(validate([block({ children: [span("bold", ["strong"])] })])).toBe(
      true
    )
  })

  test("fails with multiple standard marks", () => {
    const result = validate([
      block({ children: [span("bold italic", ["strong", "em"])] }),
    ])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty(
      "message",
      "Text cannot have multiple marks applied (e.g. bold and italic)"
    )
  })

  test("allows stacking custom marks", () => {
    expect(
      validate([
        block({ children: [span("custom", ["highlight", "footnote"])] }),
      ])
    ).toBe(true)
  })

  test("allows one standard mark with custom marks", () => {
    expect(
      validate([block({ children: [span("mixed", ["strong", "highlight"])] })])
    ).toBe(true)
  })

  test("fails with two standard marks even alongside custom", () => {
    const result = validate([
      block({
        children: [span("mixed", ["strong", "em", "highlight"])],
      }),
    ])
    expect(result).not.toBe(true)
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })
})

describe("noMarksOnHeadings", () => {
  const validate = blockValidations.noMarksOnHeadings

  test("passes for headings without marks", () => {
    expect(validate([block({ style: "h1", children: [span("Title")] })])).toBe(
      true
    )
  })

  test("fails for headings with marks", () => {
    const result = validate([
      block({ style: "h2", children: [span("Title", ["strong"])] }),
    ])
    expect(result).not.toBe(true)
    expect(result).toHaveProperty(
      "message",
      "Headings cannot have marks applied (e.g. bold, links, etc.)"
    )
  })

  test("allows marks on non-heading styles", () => {
    expect(
      validate([
        block({ style: "normal", children: [span("Bold", ["strong"])] }),
      ])
    ).toBe(true)
  })

  test("checks all heading levels", () => {
    for (const style of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      const result = validate([
        block({ style, children: [span("Title", ["em"])] }),
      ])
      expect(result).not.toBe(true)
    }
  })

  test("passes for undefined input", () => {
    expect(validate(undefined)).toBe(true)
  })
})
