module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "esbuild-jest-transform",
  },
  testEnvironment: "jest-environment-node",
}
