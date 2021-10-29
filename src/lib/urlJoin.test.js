import urlJoin from "./urlJoin"

test("avoid double delimiter", () => {
  expect(urlJoin("/foo/", "/bar/")).toBe("/foo/bar/")
})

test("accept trailing delimiter", () => {
  expect(urlJoin("/foo/", "bar/")).toBe("/foo/bar/")
})

test("accept preceding delimiter", () => {
  expect(urlJoin("/foo", "/bar/")).toBe("/foo/bar/")
})

test("inserts delimiter", () => {
  expect(urlJoin("/foo", "bar/")).toBe("/foo/bar/")
})

test("delimiter-only args", () => {
  expect(urlJoin("/", "/foo/", "/", "bar", "/")).toBe("/foo/bar/")
})
