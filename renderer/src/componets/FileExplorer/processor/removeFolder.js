const fs = window.require('fs')
const Path = window.require('path')

const deleteFolderRecursive = function(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(file => {
      let curPath = Path.resolve(path, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

export default path => {
  try {
    deleteFolderRecursive(path)
    return true
  } catch (e) {
    return false
  }
}
