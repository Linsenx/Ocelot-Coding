const { app } = window.require('electron').remote
const fs = window.require('fs')
const path = window.require('path')
const fsPromise = fs.promises

/**
 * 项目路径
 */
export const projectPath = path.resolve(app.getPath('userData'), './project')

/**
 * 垃圾箱路径
 */
export const trashbinPath = path.resolve(app.getPath('userData'), './trashbin')

export function initOceFolderSync() {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath)
  }
  if (!fs.existsSync(trashbinPath)) {
    fs.mkdirSync(trashbinPath)
  }
}

export async function initOceFolderAsync() {
  await Promise.all([
    fsPromise.stat(projectPath).catch(async err => {
      await fsPromise.mkdir(projectPath)
    }),
    fsPromise.stat(trashbinPath).catch(async err => {
      await fsPromise.mkdir(trashbinPath)
    })
  ])
}