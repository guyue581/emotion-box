const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

contextBridge.exposeInMainWorld('electronAPI', {
  // 收藏相关
  getCollections: () => ipcRenderer.invoke('get-collections'),
  saveCollection: (collection) => ipcRenderer.invoke('save-collection', collection),
  deleteCollection: (id) => ipcRenderer.invoke('delete-collection', id),

  // 设置相关
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // 自定义语录相关
  getCustomQuotes: () => ipcRenderer.invoke('get-custom-quotes'),
  saveCustomQuote: (quote) => ipcRenderer.invoke('save-custom-quote', quote),
  deleteCustomQuote: (id) => ipcRenderer.invoke('delete-custom-quote', id),

  // 心情日记相关
  getMoodDiaries: () => ipcRenderer.invoke('get-mood-diaries'),
  saveMoodDiary: (diary) => ipcRenderer.invoke('save-mood-diary', diary),
  deleteMoodDiary: (id) => ipcRenderer.invoke('delete-mood-diary', id),

  // 声音盲盒收藏相关
  getVoiceBoxFavorites: () => ipcRenderer.invoke('get-voice-box-favorites'),
  saveVoiceBoxFavorite: (item) => ipcRenderer.invoke('save-voice-box-favorite', item),
  deleteVoiceBoxFavorite: (id) => ipcRenderer.invoke('delete-voice-box-favorite', id),

  // 音频文件路径
  getAudioBasePath: () => ipcRenderer.invoke('get-audio-base-path')
})
