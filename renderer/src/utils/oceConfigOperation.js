const fs = window.require('fs')
const path = window.require('path')

const readOceConfig = (projectpath) => {
  console.log('read config')
  const configPath = path.resolve(projectpath, './oce_package.json')
  const hasConfig = fs.existsSync(configPath)
  if (hasConfig === false) return false
  const oceConfig = JSON.parse(fs.readFileSync(configPath).toString())
  return oceConfig
}

const writeOceConfig = (filepath, newConfig) => {
  const configPath = path.resolve(filepath, './oce_package.json')
  fs.writeFileSync(configPath, JSON.stringify(newConfig))
}

export { readOceConfig, writeOceConfig }