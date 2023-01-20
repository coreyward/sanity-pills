const pattern = /^(?:image|file)-([a-f\d]+)-(?:(\d+x\d+)-)?(\w+)$/

/**
 * @typedef {object} AssetDimensions
 * @property {number} width The width of the asset
 * @property {number} height The height of the asset
 *
 * @typedef {object} AssetProperties
 * @property {string} assetId The Sanity asset ID
 * @property {AssetDimensions} [dimensions] The dimensions of the asset (if applicable)
 * @property {string} format The format/extension of the asset
 */

/**
 * Decode a Sanity asset ID into its parts.
 *
 * @param {string} id The Sanity asset ID
 * @returns {AssetProperties} The decoded asset ID
 */
export const decodeAssetId = (id) => {
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
