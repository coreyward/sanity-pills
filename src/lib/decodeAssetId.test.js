import decodeAssetId from "./decodeAssetId"

describe("decodeAssetId", () => {
  test("extracts parts from image asset ID", () => {
    const parsed = decodeAssetId(
      "image-8a03588d78e5b5645298e8dd903dcaa0dffa0e20-1162x868-png"
    )
    expect(parsed).toEqual({
      assetId: "8a03588d78e5b5645298e8dd903dcaa0dffa0e20",
      dimensions: {
        width: 1162,
        height: 868,
      },
      format: "png",
    })
  })

  test("extracts parts from file asset ID", () => {
    const parsed = decodeAssetId(
      "file-a05701458c0906fda0dc85eaf49011f406fbc00f-mp4"
    )
    expect(parsed).toEqual({
      assetId: "a05701458c0906fda0dc85eaf49011f406fbc00f",
      dimensions: {
        width: undefined,
        height: undefined,
      },
      format: "mp4",
    })
  })
})
