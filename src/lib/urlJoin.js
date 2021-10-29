const urlJoin = (...parts) =>
  parts.reduce((result, part) => {
    if (!part) return result

    const trailingSlashPresent = result.substr(-1) === "/"
    const preceedingSlashPresent = part[0] === "/"

    return trailingSlashPresent !== preceedingSlashPresent
      ? result + part
      : trailingSlashPresent && preceedingSlashPresent
      ? result + part.substr(1)
      : result + "/" + part
  }, "" + parts.shift())

export default urlJoin
