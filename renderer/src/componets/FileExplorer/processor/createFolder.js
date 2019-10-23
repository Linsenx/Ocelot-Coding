import createDeafultConfig from "./createDefaultConfig"
import tryCreactFolder from "./tryCreateFolder"

export default (path) => {
  const newPath = tryCreactFolder(path, '新建文件夹')
  createDeafultConfig(newPath, 'folder')
}