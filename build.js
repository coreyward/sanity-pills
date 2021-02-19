const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["./src/index.js"],
    external: ["lodash", "slugify"],
    bundle: true,
    minify: true,
    outdir: "dist",
    target: "es2017",
    format: "cjs",
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
