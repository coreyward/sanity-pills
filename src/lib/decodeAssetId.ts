const pattern = /^(?:image|file)-([a-f\d]+)-(?:(\d+x\d+)-)?(\w+)$/

type AssetDimensions = {
  width: number
  height: number
}

type AssetProperties = {
  assetId: string
  dimensions?: AssetDimensions
  format: string
}

/**
 * Decode a Sanity asset ID into its parts.
 */
export const decodeAssetId = (id: string): AssetProperties => {
  const [, assetId, dimensions, format] = pattern.exec(id)
  const [width, height] = dimensions
    ? dimensions.split("x").map((v) => parseInt(v, 10))
    : []

  return {
    assetId,
    dimensions: { width, height },
    format,
  }
}
