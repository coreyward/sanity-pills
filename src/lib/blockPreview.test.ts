import { describe, it, expect } from "vitest"
import type { PortableTextBlock } from "@sanity/types"
import { blockPreview } from "./blockPreview"

describe("blockPreview", () => {
  it("returns null for undefined or empty content", () => {
    expect(blockPreview(undefined)).toBeNull()
    expect(blockPreview([])).toBeNull()
  })

  it("reduces a single block to its span text only", () => {
    const content = [
      {
        _type: "block",
        _key: "key",
        // children includes valid spans and various non-span entries to ensure filtering works
        children: [
          { _type: "span", text: "Hello" },
          { _type: "notSpan", customField: "IGNORE" },
          { _type: "span", text: 123 },
          { _type: "span", text: " world!" },
          null,
        ],
      } satisfies PortableTextBlock,
    ]

    expect(blockPreview(content)).toBe("Hello world!")
  })

  it("concatenates multiple blocks separated by spaces", () => {
    const content = [
      {
        _type: "block",
        _key: "block-key-1",
        children: [{ _type: "span", text: "Hello" }],
      } satisfies PortableTextBlock,
      {
        _type: "image", // non-block should be ignored
        _key: "image-key",
      } satisfies PortableTextBlock,
      {
        _type: "block",
        _key: "block-key-2",
        children: [
          { _type: "span", text: "world" },
          { _type: "notSpan", text: "!" },
        ],
      } satisfies PortableTextBlock,
    ]

    expect(blockPreview(content)).toBe("Hello world")
  })

  it("returns empty string when content has no blocks", () => {
    const content = [
      { _type: "image", _key: "image-key" },
      { _type: "code", _key: "code-key" },
    ] satisfies PortableTextBlock[]

    expect(blockPreview(content)).toBe("")
  })
})
