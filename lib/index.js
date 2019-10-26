const isDev = require('electron-is-dev')
const { format } = require('url')
const { resolve } = require('app-root-path')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const devPath = 'http://127.0.0.1:8080'
  const prodPath = format({
    pathname: resolve('renderer/index.html'),
    protocol: 'file:',
    slashes: true
  })
  mainWindow.loadURL(isDev ? devPath : prodPath)
}

app.on('ready', createWindow)

ipcMain.on('close', e => {
  mainWindow.close()
})
ipcMain.on('minimize', e => {
  mainWindow.minimize()
})