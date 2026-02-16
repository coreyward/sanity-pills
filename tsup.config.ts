import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  target: "es2023",
})
