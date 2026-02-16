import { describe, it, expect } from "vitest"
import { urlJoin } from "./urlJoin"

describe("urlJoin", () => {
  it("avoids double delimiter", () => {
    expect(urlJoin("/foo/", "/bar/")).toBe("/foo/bar/")
  })

  it("accepts trailing delimiter", () => {
    expect(urlJoin("/foo/", "bar/")).toBe("/foo/bar/")
  })

  it("accepts preceding delimiter", () => {
    expect(urlJoin("/foo", "/bar/")).toBe("/foo/bar/")
  })

  it("inserts delimiter", () => {
    expect(urlJoin("/foo", "bar/")).toBe("/foo/bar/")
  })

  it("handles delimiter-only args", () => {
    expect(urlJoin("/", "/foo/", "/", "bar", "/")).toBe("/foo/bar/")
  })

  it("ignores internal delimiters", () => {
    expect(urlJoin("/f/o/o/", "/b/a/r/")).toBe("/f/o/o/b/a/r/")
  })

  it("preserves existing double slashes", () => {
    expect(urlJoin("foo//", "bar")).toBe("foo//bar")
  })

  it("does not insert preceding and trailing slashes", () => {
    expect(urlJoin("foo", "bar")).toBe("foo/bar")
  })

  it("returns single argument as-is", () => {
    expect(urlJoin("foo")).toBe("foo")
    expect(urlJoin("foo/")).toBe("foo/")
    expect(urlJoin("/foo")).toBe("/foo")
  })

  it("collapses delimiters infinitely", () => {
    expect(urlJoin("/", "/", "/", "/", "/")).toBe("/")
  })
})
