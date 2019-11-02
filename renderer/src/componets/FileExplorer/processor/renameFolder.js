import {
  readOceConfig,
  writeOceConfig
} from '../../../utils/oceConfigOperation'
const Path = window.require('path')

export default (path, newname) => {
  const filename = Path.resolve(path)
    .split(Path.sep)
    .pop()
  if (filename === '..') return false
  const config = readOceConfig(path)
  if (!config) return false
  config.filename = newname
  writeOceConfig(path, config)
  return true
}
