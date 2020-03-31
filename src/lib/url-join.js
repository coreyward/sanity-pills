const urlJoin = (...parts) => {
  let result = "" + parts.shift()
  parts.forEach(part => {
    if (!part) return

    const trailingSlashPresent = result.charAt(result.length - 1) === "/"
    const preceedingSlashPresent = part.charAt(0) === "/"

    if (trailingSlashPresent) {
      if (preceedingSlashPresent) {
        result = result + part.substr(1)
      } else {
        result = result + part
      }
    } else {
      if (preceedingSlashPresent) {
        result = result + part
      } else {
        result = result + "/" + part
      }
    }
  })

  return result
}

export default urlJoin
