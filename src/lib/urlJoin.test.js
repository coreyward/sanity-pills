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

test("internal delimiters ignored", () => {
  expect(urlJoin("/f/o/o/", "/b/a/r/")).toBe("/f/o/o/b/a/r/")
})

test("does not insert preceding and trailing slashes", () => {
  expect(urlJoin("foo", "bar")).toBe("foo/bar")
})

test("single argument returned as-is", () => {
  expect(urlJoin("foo")).toBe("foo")
  expect(urlJoin("foo/")).toBe("foo/")
  expect(urlJoin("/foo")).toBe("/foo")
})

test("delimiters collapsed infinitely", () => {
  expect(urlJoin("/", "/", "/", "/", "/")).toBe("/")
})
