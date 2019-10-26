const fs = window.require('fs')
const path = window.require('path')

export default (folderpath, name) => {
  // let id = 1;
  // const getNewFolderPath = () => {
  //   return `${path}/${name} ${id}`
  // }
  // let newPath = ''
  // while (fs.existsSync(newPath = getNewFolderPath())) {
  //   id ++
  // }

  const timestamp = './' + new Date().valueOf().toString()
  const newpath = path.resolve(folderpath, timestamp)
  fs.mkdirSync(newpath)
  return newpath
}