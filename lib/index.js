const { format } = require('url')
const { resolve } = require('app-root-path')
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    'min-width': 500,
    'min-height': 400,
    frame: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true
    }
  })

  const devPath = 'http://127.0.0.1:1234'

  const prodPath = format({
    pathname: resolve('renderer/index.html'),
    protocol: 'file:',
    slashes: true
  })
  win.loadURL(devPath)
}

app.on('ready', createWindow)