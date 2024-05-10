import { app, shell, BrowserWindow, ipcMain, Tray, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  deleteProjectFiles,
  getProjectCanvas,
  getProjectMarkdown,
  getProjects,
  updateProject,
  updateProjectCanvas,
  updateProjectMarkdown
} from './store'
import {
  DeleteProjectFiles,
  GetProjectCanvas,
  GetProjectMarkdown,
  GetProjects,
  UpdateProject,
  UpdateProjectCanvas,
  UpdateProjectMarkdown
} from '@shared/types'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minHeight: 670,
    minWidth: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    center: true,
    title: 'Neptune',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray: Tray
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('neptune')

  const trayIcon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'))
  tray = new Tray(trayIcon)
  tray.setToolTip('Neptune')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('FETCH_PROJECTS', (_, ...args: Parameters<GetProjects>) => getProjects(...args))
  ipcMain.handle('WRITE_DATA', (_, ...args: Parameters<UpdateProject>) => updateProject(...args))
  ipcMain.handle('FETCH_PROJECT_CANVAS', (_, ...args: Parameters<GetProjectCanvas>) =>
    getProjectCanvas(...args)
  )
  ipcMain.handle('UPDATE_PROJECT_CANVAS', (_, ...args: Parameters<UpdateProjectCanvas>) =>
    updateProjectCanvas(...args)
  )
  ipcMain.handle('FETCH_PROJECT_MARKDOWN', (_, ...args: Parameters<GetProjectMarkdown>) =>
    getProjectMarkdown(...args)
  )
  ipcMain.handle('UPDATE_PROJECT_MARKDOWN', (_, ...args: Parameters<UpdateProjectMarkdown>) =>
    updateProjectMarkdown(...args)
  )
  ipcMain.handle('DELETE_PROJECT', (_, ...args: Parameters<DeleteProjectFiles>) =>
    deleteProjectFiles(...args)
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
