const isDev = require('electron-is-dev')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const package = require('../package.json')

let isOsx = process.platform === 'darwin'

let MainMenu = [
  {
    label: 'Ocelot',
    submenu: [
      {
        label: 'About Ocelot Coding',
        role: 'about'
      },
      {
        label: 'Quit Ocelot Coding',
        click() {
          mainWindow.close()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  }
]

let menu
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
      // devTools: false
    }
  })

  const devPath = 'http://127.0.0.1:8080'
  const prodPath = 'file://' + path.join(__dirname, '..', 'dist', 'index.html')
  mainWindow.loadURL(isDev ? devPath : prodPath)

  if (isOsx) {
    menu = Menu.buildFromTemplate(MainMenu)
    Menu.setApplicationMenu(menu)
    app.setAboutPanelOptions({
      applicationName: 'Ocelot Coding',
      applicationVersion: package.version,
      copyright:
        'Made by NightCatS. \n https://github.com/nightcats/ocelot-coding',
      version: package.version
    })
  }
}

app.on('ready', createWindow)

ipcMain.on('close', e => {
  mainWindow.close()
})
ipcMain.on('minimize', e => {
  mainWindow.minimize()
})
