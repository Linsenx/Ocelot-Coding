const fs = window.require('fs')
import createDeafultConfig from "./createDefaultConfig"
import tryCreactFolder from "./tryCreateFolder"

export default (path) => {
  const newPath = tryCreactFolder(path)
  fs.writeFileSync(`${newPath}/index.html`, Buffer.from(''))
  fs.writeFileSync(`${newPath}/main.js`, Buffer.from(''))
  fs.writeFileSync(`${newPath}/style.css`, Buffer.from(''))
  createDeafultConfig({ path: newPath, filetype: 'jsproject', filename: '新建JS项目' })
}