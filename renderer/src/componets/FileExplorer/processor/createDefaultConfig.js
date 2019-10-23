const fs = window.require('fs')

export default (path, filetype) => {
  const config = {
    folder: {
      filetype: 'folder',
      createAt: new Date().valueOf(),
      updateAt: new Date().valueOf()
    },
    jsproject: {
      filetype: 'jsproject',
      createAt: new Date().valueOf(),
      updateAt: new Date().valueOf()
    }
  }

  const getConfigPath = () => {
    return `${path}/oce_package.json`
  }

  if (config[filetype] === undefined) return
  fs.writeFileSync(getConfigPath(), Buffer.from(JSON.stringify(config[filetype])))
}