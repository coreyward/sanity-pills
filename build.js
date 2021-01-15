const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["./src/index.js"],
    external: ["slugify"],
    bundle: true,
    minify: true,
    outdir: "dist",
    platform: "node",
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
