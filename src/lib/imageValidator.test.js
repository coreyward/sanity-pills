import {
  buildImageValidator,
  validators,
  warningValidators,
} from "./imageValidator"

test("minWidth", () => {
  const validator = buildImageValidator({ minWidth: 500 }, validators)

  expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(true)
  expect(validator({ asset: { _ref: "image-abc123-499x500-png" } })).toBe(
    "Image must be at least 500px wide"
  )
})

test("maxWidth", () => {
  const validator = buildImageValidator({ maxWidth: 500 }, validators)

  expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(true)
  expect(validator({ asset: { _ref: "image-abc123-501x500-png" } })).toBe(
    "Image must be less than 500px wide"
  )
})

test("minHeight", () => {
  const validator = buildImageValidator({ minHeight: 500 }, validators)

  expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(true)
  expect(validator({ asset: { _ref: "image-abc123-500x499-png" } })).toBe(
    "Image must be at least 500px tall"
  )
})

test("maxHeight", () => {
  const validator = buildImageValidator({ maxHeight: 500 }, validators)

  expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(true)
  expect(validator({ asset: { _ref: "image-abc123-500x501-png" } })).toBe(
    "Image must be less than 500px tall"
  )
})

describe("warnings", () => {
  test("minWidth", () => {
    const validator = buildImageValidator({ minWidth: 500 }, warningValidators)

    expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(
      true
    )
    expect(validator({ asset: { _ref: "image-abc123-499x500-png" } })).toBe(
      "Image should be at least 500px wide for best results"
    )
  })

  test("maxWidth", () => {
    const validator = buildImageValidator({ maxWidth: 500 }, warningValidators)

    expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(
      true
    )
    expect(validator({ asset: { _ref: "image-abc123-501x500-png" } })).toBe(
      "Image should be less than 500px wide for best results"
    )
  })

  test("minHeight", () => {
    const validator = buildImageValidator({ minHeight: 500 }, warningValidators)

    expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(
      true
    )
    expect(validator({ asset: { _ref: "image-abc123-500x499-png" } })).toBe(
      "Image should be at least 500px tall for best results"
    )
  })

  test("maxHeight", () => {
    const validator = buildImageValidator({ maxHeight: 500 }, warningValidators)

    expect(validator({ asset: { _ref: "image-abc123-500x500-png" } })).toBe(
      true
    )
    expect(validator({ asset: { _ref: "image-abc123-500x501-png" } })).toBe(
      "Image should be less than 500px tall for best results"
    )
  })
})
