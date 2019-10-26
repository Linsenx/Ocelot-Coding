import { readOceConfig, writeOceConfig } from "../../../utils/oceConfigOperation"

export default (path, newname) => {
  const config = readOceConfig(path)
  if (!config) return false
  config.filename = newname
  writeOceConfig(path, config)
  return true
}