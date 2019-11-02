const fs = window.require('fs')
const path = window.require('path')
import { trashbinPath } from '../../../utils/oceFolderInitialization'

export default oldpath => {
  try {
    const foldername = path
      .resolve(oldpath)
      .split(path.sep)
      .pop()
    if (foldername === 'project') {
      return false
    }
    const newpath = path.resolve(trashbinPath, foldername)
    fs.renameSync(oldpath, newpath)
    return true
  } catch (e) {
    return false
  }
}
