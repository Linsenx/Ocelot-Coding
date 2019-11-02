const fs = window.require('fs')
const path = window.require('path')

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default folderpath => {
  const timestamp = './' + generateUUID()
  const newpath = path.resolve(folderpath, timestamp)
  fs.mkdirSync(newpath)
  return newpath
}
