const fs = window.require('fs')

export default (oldpath, newpath) => {
  try {
    fs.renameSync(oldpath, newpath)
    return true
  } catch (e) {
    return false
  }
}