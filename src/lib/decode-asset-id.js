const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/

export default id => {
  const [, assetId, dimensions, format] = pattern.exec(id)
  const [width, height] = dimensions.split("x").map(v => parseInt(v, 10))

  return {
    assetId,
    dimensions: { width, height },
    format,
  }
}
