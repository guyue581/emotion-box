const { app, BrowserWindow, ipcMain, Menu, protocol, net } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow

function getAudioDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'audio')
  }
  return path.join(__dirname, '..', 'public', 'audio')
}

app.whenReady().then(() => {
  protocol.handle('local-audio', (request) => {
    const fileName = request.url.replace('local-audio://', '')
    const filePath = path.join(getAudioDir(), decodeURIComponent(fileName))
    if (fs.existsSync(filePath)) {
      return net.fetch('file:///' + filePath.replace(/\\/g, '/'))
    }
    return new Response('Not found', { status: 404 })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 700,
    minWidth: 380,
    minHeight: 600,
    frame: true,
    resizable: true,
    backgroundColor: '#f5f7fa',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.ico')
  })

  Menu.setApplicationMenu(null)

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.webContents.on('crashed', () => {
    console.error('渲染进程崩溃')
  })
  mainWindow.webContents.on('unresponsive', () => {
    console.error('渲染进程无响应')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const userDataPath = app.getPath('userData')
const collectionsFile = path.join(userDataPath, 'collections.json')
const settingsFile = path.join(userDataPath, 'settings.json')
const customQuotesFile = path.join(userDataPath, 'customQuotes.json')
const moodDiariesFile = path.join(userDataPath, 'moodDiaries.json')
const voiceBoxFavoritesFile = path.join(userDataPath, 'voiceBoxFavorites.json')

function readFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    return null
  } catch (error) {
    console.error('读取文件失败:', filePath, error)
    return null
  }
}

function writeFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入文件失败:', filePath, error)
    return false
  }
}

// 收藏
ipcMain.handle('get-collections', async () => {
  return readFile(collectionsFile) || []
})

ipcMain.handle('save-collection', async (event, collection) => {
  const collections = readFile(collectionsFile) || []
  collections.unshift(collection)
  return writeFile(collectionsFile, collections)
})

ipcMain.handle('delete-collection', async (event, id) => {
  const collections = readFile(collectionsFile) || []
  return writeFile(collectionsFile, collections.filter(c => c.id !== id))
})

// 设置
ipcMain.handle('get-settings', async () => {
  return readFile(settingsFile) || { theme: 'light', apiKey: '' }
})

ipcMain.handle('save-settings', async (event, settings) => {
  return writeFile(settingsFile, settings)
})

// 自定义语录
ipcMain.handle('get-custom-quotes', async () => {
  return readFile(customQuotesFile) || []
})

ipcMain.handle('save-custom-quote', async (event, quote) => {
  const quotes = readFile(customQuotesFile) || []
  quotes.push(quote)
  return writeFile(customQuotesFile, quotes)
})

ipcMain.handle('delete-custom-quote', async (event, id) => {
  const quotes = readFile(customQuotesFile) || []
  return writeFile(customQuotesFile, quotes.filter(q => q.id !== id))
})

// 心情日记
ipcMain.handle('get-mood-diaries', async () => {
  return readFile(moodDiariesFile) || []
})

ipcMain.handle('save-mood-diary', async (event, diary) => {
  const diaries = readFile(moodDiariesFile) || []
  const existingIndex = diaries.findIndex(d => d.id === diary.id)
  if (existingIndex >= 0) {
    diaries[existingIndex] = diary
  } else {
    diaries.unshift(diary)
  }
  return writeFile(moodDiariesFile, diaries)
})

ipcMain.handle('delete-mood-diary', async (event, id) => {
  const diaries = readFile(moodDiariesFile) || []
  return writeFile(moodDiariesFile, diaries.filter(d => d.id !== id))
})

// 声音盲盒收藏
ipcMain.handle('get-voice-box-favorites', async () => {
  return readFile(voiceBoxFavoritesFile) || []
})

ipcMain.handle('save-voice-box-favorite', async (event, item) => {
  const favorites = readFile(voiceBoxFavoritesFile) || []
  favorites.push(item)
  return writeFile(voiceBoxFavoritesFile, favorites)
})

ipcMain.handle('delete-voice-box-favorite', async (event, id) => {
  const favorites = readFile(voiceBoxFavoritesFile) || []
  return writeFile(voiceBoxFavoritesFile, favorites.filter(f => f.id !== id))
})

// 音频文件路径（使用local-audio://协议）
ipcMain.handle('get-audio-base-path', async () => {
  return 'local-audio://'
})
