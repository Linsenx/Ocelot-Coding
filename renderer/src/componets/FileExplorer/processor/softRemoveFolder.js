const fs = window.require('fs')
const path = window.require('path')
const { app } = window.require('electron').remote
const trashbinPath = app.getPath('userData') + '/trashbin'

export default (oldpath) => {
  try {
    const filename = oldpath.split('/').pop()
    const newpath = path.resolve(trashbinPath, filename + '-' + new Date().valueOf())
    fs.renameSync(oldpath, newpath)
    return true
  } catch (e) {
    return false
  }
}