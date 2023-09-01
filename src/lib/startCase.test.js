import {
  startCase,
  isCamelCase,
  splitCamelCase,
  splitDelimited,
} from "./startCase" // Replace 'yourFile' with the actual file name

describe("startCase", () => {
  it("converts camelCase to Start Case", () => {
    expect(startCase("helloWorld")).toBe("Hello World")
    expect(startCase("hiii")).toBe("Hiii")
  })

  it("converts CamelCase to Start Case", () => {
    expect(startCase("HelloWorld")).toBe("Hello World")
  })

  it("handles acronyms", () => {
    expect(startCase("helloWorldHTML")).toBe("Hello World HTML")
  })

  it("converts snake_case to Start Case", () => {
    expect(startCase("hello_world")).toBe("Hello World")
  })

  it("converts kebab-case to Start Case", () => {
    expect(startCase("hello-world")).toBe("Hello World")
  })

  it("converts space separated to Start Case", () => {
    expect(startCase("hello world")).toBe("Hello World")
  })
})

describe("isCamelCase", () => {
  it("returns true for camelCase", () => {
    expect(isCamelCase("helloWorld")).toBe(true)
    expect(isCamelCase("HelloWorld")).toBe(true)
  })

  it("returns false for not camelCase", () => {
    expect(isCamelCase("Hello World")).toBe(false)
    expect(isCamelCase("hello_world")).toBe(false)
    expect(isCamelCase("hello-world")).toBe(false)
    expect(isCamelCase("helloWorld is cool")).toBe(false)
  })
})

describe("splitCamelCase", () => {
  it("splits camelCase into words", () => {
    expect(splitCamelCase("helloWorld")).toEqual(["hello", "World"])
  })

  it("splits UpperCamelCase into words", () => {
    expect(splitCamelCase("HelloWorld")).toEqual(["Hello", "World"])
  })
})

describe("splitDelimited", () => {
  it("splits snake_case into words", () => {
    expect(splitDelimited("hello_world")).toEqual(["hello", "world"])
  })

  it("splits kebab-case into words", () => {
    expect(splitDelimited("hello-world")).toEqual(["hello", "world"])
  })

  it("splits space separated into words", () => {
    expect(splitDelimited("hello world")).toEqual(["hello", "world"])
  })

  it("trims extra characters", () => {
    expect(splitDelimited("  hello  world  ")).toEqual(["hello", "world"])
    expect(splitDelimited("--hello--world--")).toEqual(["hello", "world"])
    expect(splitDelimited("__hello__world__")).toEqual(["hello", "world"])
  })
})
