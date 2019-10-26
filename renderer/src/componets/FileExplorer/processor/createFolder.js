import createDeafultConfig from "./createDefaultConfig"
import tryCreactFolder from "./tryCreateFolder"

export default (path) => {
  const newPath = tryCreactFolder(path)
  createDeafultConfig({ path: newPath, filetype: 'folder', filename: '新建文件夹' })
}