const fs = window.require('fs')
import { readOceConfig, writeOceConfig } from '../../../utils/oceConfigOperation'

export default ({ path, config, JS = '', CSS = '', HTML= '' }) => {
  config && writeOceConfig(path, config)
  fs.writeFileSync(`${path}/main.js`, Buffer.from(JS))
  fs.writeFileSync(`${path}/style.css`, Buffer.from(CSS))
  fs.writeFileSync(`${path}/index.html`, Buffer.from(HTML))
}