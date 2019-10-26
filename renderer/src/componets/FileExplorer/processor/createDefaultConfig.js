const fs = window.require('fs')

export default ({ path, filetype, filename }) => {
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

  const getConfig = () => {
    const typedConfig = config[filetype]
    if (typedConfig === undefined) return undefined
    typedConfig.filename = filename
    return typedConfig
  }

  if (getConfig() === undefined) return
  fs.writeFileSync(getConfigPath(), Buffer.from(JSON.stringify(getConfig())))
}