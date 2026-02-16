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
  const match = pattern.exec(id)
  if (!match) {
    throw new Error(`Invalid asset ID: ${id}`)
  }
  const [, assetId, dimensions, format] = match

  if (!assetId || !format) {
    throw new Error(`Invalid asset ID: ${id}`)
  }

  if (dimensions) {
    const parsedDimensions = dimensions.split("x").map((v) => parseInt(v, 10))
    if (parsedDimensions.length === 2) {
      return {
        assetId,
        dimensions: {
          width: parsedDimensions[0]!,
          height: parsedDimensions[1]!,
        },
        format,
      }
    }
  }

  return {
    assetId,
    format,
  }
}
