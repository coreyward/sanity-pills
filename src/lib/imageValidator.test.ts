import { describe, test, expect } from "vitest"
import type { Schema, ValidationContext } from "@sanity/types"
import {
  buildImageValidator,
  validators,
  getWarningValidators,
} from "./imageValidator"

const mockContext: ValidationContext = {
  getClient: () => ({}) as never,
  schema: {} as Schema,
  environment: "studio",
}

test("minWidth", () => {
  const validator = buildImageValidator({ minWidth: 500 }, validators)

  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-499x500-png" } },
      mockContext
    )
  ).toBe("Image must be at least 500px wide")
})

test("maxWidth", () => {
  const validator = buildImageValidator({ maxWidth: 500 }, validators)

  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-501x500-png" } },
      mockContext
    )
  ).toBe("Image must be less than 500px wide")
})

test("minHeight", () => {
  const validator = buildImageValidator({ minHeight: 500 }, validators)

  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x499-png" } },
      mockContext
    )
  ).toBe("Image must be at least 500px tall")
})

test("maxHeight", () => {
  const validator = buildImageValidator({ maxHeight: 500 }, validators)

  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x501-png" } },
      mockContext
    )
  ).toBe("Image must be less than 500px tall")
})

test("allowedFormats", () => {
  const validator = buildImageValidator(
    { allowedFormats: ["jpg", "png"] },
    validators
  )

  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-jpg" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-gif" } },
      mockContext
    )
  ).toBe("Image must be in jpg or png format")
})

test("allowedFormats single", () => {
  const validator = buildImageValidator({ allowedFormats: ["svg"] }, validators)

  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-svg" } },
      mockContext
    )
  ).toBe(true)
  expect(
    validator(
      { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
      mockContext
    )
  ).toBe("Image must be in svg format")
})

describe("warnings", () => {
  const warningValidators = getWarningValidators()

  test("minWidth", () => {
    const validator = buildImageValidator({ minWidth: 500 }, warningValidators)

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-499x500-png" } },
        mockContext
      )
    ).toBe("Image should be at least 500px wide for best results")
  })

  test("maxWidth", () => {
    const validator = buildImageValidator({ maxWidth: 500 }, warningValidators)

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-501x500-png" } },
        mockContext
      )
    ).toBe("Image should be less than 500px wide for best results")
  })

  test("minHeight", () => {
    const validator = buildImageValidator({ minHeight: 500 }, warningValidators)

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x499-png" } },
        mockContext
      )
    ).toBe("Image should be at least 500px tall for best results")
  })

  test("maxHeight", () => {
    const validator = buildImageValidator({ maxHeight: 500 }, warningValidators)

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x501-png" } },
        mockContext
      )
    ).toBe("Image should be less than 500px tall for best results")
  })

  test("allowedFormats", () => {
    const validator = buildImageValidator(
      { allowedFormats: ["jpg", "png"] },
      warningValidators
    )

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-png" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-jpg" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-gif" } },
        mockContext
      )
    ).toBe("Image should be in jpg or png format for best results")
  })
})

describe("svg allowances", () => {
  test("minWidth", () => {
    const validator = buildImageValidator({ minWidth: 500 }, validators)

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-svg" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-499x500-svg" } },
        mockContext
      )
    ).toBe(true)
  })

  test("minHeight", () => {
    const validator = buildImageValidator({ minHeight: 500 }, validators)

    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x500-svg" } },
        mockContext
      )
    ).toBe(true)
    expect(
      validator(
        { asset: { _type: "reference", _ref: "image-abc123-500x499-svg" } },
        mockContext
      )
    ).toBe(true)
  })
})
