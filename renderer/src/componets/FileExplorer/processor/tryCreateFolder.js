const fs = window.require('fs')

export default (path, name) => {
  let id = 1;

  const getNewFolderPath = () => {
    return `${path}/${name} ${id}`
  }

  let newPath = ''
  while (fs.existsSync(newPath = getNewFolderPath())) {
    id ++
  }
  fs.mkdirSync(newPath)
  return newPath
}