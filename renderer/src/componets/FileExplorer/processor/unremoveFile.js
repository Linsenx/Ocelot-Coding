const fs = window.require('fs')
const path = window.require('path')
import { projectPath } from '../../../utils/oceFolderInitialization'

export default file => {
  try {
    const filename = file.split(path.sep).pop()
    const newpath = path.resolve(projectPath, filename)
    fs.renameSync(file, newpath)
    return true
  } catch (e) {
    return false
  }
}