const fs = window.require('fs')
const path = window.require('path')

export default (file, target) => {
  try {
    const filename = file.split(path.sep).pop()
    const newpath = path.resolve(target, filename)
    fs.renameSync(file, newpath)
    return true
  } catch (e) {
    return false
  }
}