import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const theme = ref('light')
  const currentView = ref('home') // home, boxOpen, result, collection, settings, diary, healing, voiceBox
  const selectedEmotion = ref('')
  const currentQuote = ref(null)
  const collections = ref([])
  const customQuotes = ref([])
  
  // 心情日记数据
  const moodDiaries = ref([])
  const currentDiary = ref(null)
  
  // 治愈生成数据
  const healingContent = ref(null)
  const healingHistory = ref([])
  
  // 声音盲盒
  const voiceBoxFavorites = ref([])
  const currentPlaying = ref(null)
  
  const settings = ref({
    theme: 'light',
    apiKey: '',
    apiType: 'none',
    authType: 'api_key',
    ak: '',
    sk: '',
    customPrimaryColor: '#667eea',
    customSecondaryColor: '#764ba2',
    backgroundType: 'default',
    backgroundImage: '',
    dynamicBackground: 'particles'
  })

  // 计算属性
  const isDark = computed(() => theme.value === 'dark')

  // 方法
  function setTheme(newTheme) {
    theme.value = newTheme
    settings.value.theme = newTheme
    saveSettings()
  }

  function setView(view) {
    currentView.value = view
  }

  function setEmotion(emotion) {
    selectedEmotion.value = emotion
  }

  function setQuote(quote) {
    currentQuote.value = quote
  }

  async function loadCollections() {
    if (window.electronAPI) {
      try {
        collections.value = await window.electronAPI.getCollections()
      } catch (e) {
        console.error('加载收藏失败:', e)
      }
    }
  }

  async function addCollection(collection) {
  const item = {
    id: collection.id || Date.now().toString(),
    timestamp: collection.timestamp || new Date().toISOString(),
    source: collection.source || 'local',
    type: collection.type || 'quote',
    ...collection
  }
  
  // 清理空字符串的text字段，避免影响类型判断
  if (item.text === '' || item.text === undefined) {
    delete item.text
  }
  
  if (window.electronAPI) {
    try {
      await window.electronAPI.saveCollection(item)
      await loadCollections()
    } catch (e) {
      console.error('保存收藏失败:', e)
      collections.value.unshift(item)
    }
  } else {
    collections.value.unshift(item)
  }
}

  async function removeCollection(id) {
    if (window.electronAPI) {
      try {
        await window.electronAPI.deleteCollection(id)
        await loadCollections()
      } catch (e) {
        console.error('删除收藏失败:', e)
        collections.value = collections.value.filter(c => c.id !== id)
      }
    } else {
      collections.value = collections.value.filter(c => c.id !== id)
    }
  }

  async function loadSettings() {
    if (window.electronAPI) {
      try {
        const savedSettings = await window.electronAPI.getSettings()
        settings.value = { ...settings.value, ...savedSettings }
        theme.value = savedSettings.theme || 'light'
      } catch (e) {
        console.error('加载设置失败:', e)
      }
    }
  }

  async function saveSettings() {
    if (window.electronAPI) {
      try {
        await window.electronAPI.saveSettings(settings.value)
      } catch (e) {
        console.error('保存设置失败:', e)
      }
    }
  }

  async function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
    await saveSettings()
  }

  async function loadCustomQuotes() {
    if (window.electronAPI) {
      try {
        customQuotes.value = await window.electronAPI.getCustomQuotes()
      } catch (e) {
        console.error('加载自定义语录失败:', e)
      }
    }
  }

  async function addCustomQuote(quote) {
    if (window.electronAPI) {
      try {
        await window.electronAPI.saveCustomQuote(quote)
        await loadCustomQuotes()
      } catch (e) {
        console.error('保存自定义语录失败:', e)
        customQuotes.value.push(quote)
      }
    } else {
      customQuotes.value.push(quote)
    }
  }

  async function removeCustomQuote(id) {
    if (window.electronAPI) {
      try {
        await window.electronAPI.deleteCustomQuote(id)
        await loadCustomQuotes()
      } catch (e) {
        console.error('删除自定义语录失败:', e)
        customQuotes.value = customQuotes.value.filter(q => q.id !== id)
      }
    } else {
      customQuotes.value = customQuotes.value.filter(q => q.id !== id)
    }
  }

  // 心情日记相关方法
  async function loadMoodDiaries() {
    if (window.electronAPI) {
      try {
        moodDiaries.value = await window.electronAPI.getMoodDiaries()
      } catch (e) {
        console.error('加载日记失败:', e)
      }
    }
  }

  async function saveMoodDiary(diary) {
    // 确保数据完整
    const diaryData = {
      id: diary.id || Date.now().toString(),
      date: diary.date,
      mood: diary.mood,
      content: diary.content,
      enableAI: diary.enableAI || false,
      aiAnalysis: diary.aiAnalysis || null,
      timestamp: diary.timestamp || new Date().toISOString()
    }
    
    if (window.electronAPI) {
      try {
        await window.electronAPI.saveMoodDiary(diaryData)
        await loadMoodDiaries()
      } catch (e) {
        console.error('保存日记失败:', e)
        // 即使electron保存失败，也更新本地内存
        const existingIndex = moodDiaries.value.findIndex(d => d.id === diaryData.id)
        if (existingIndex >= 0) {
          moodDiaries.value[existingIndex] = diaryData
        } else {
          moodDiaries.value.unshift(diaryData)
        }
      }
    } else {
      // 无electron环境时，直接操作内存
      const existingIndex = moodDiaries.value.findIndex(d => d.id === diaryData.id)
      if (existingIndex >= 0) {
        moodDiaries.value[existingIndex] = diaryData
      } else {
        moodDiaries.value.unshift(diaryData)
      }
    }
  }

  async function deleteMoodDiary(id) {
    if (window.electronAPI) {
      try {
        await window.electronAPI.deleteMoodDiary(id)
        await loadMoodDiaries()
      } catch (e) {
        console.error('删除日记失败:', e)
        moodDiaries.value = moodDiaries.value.filter(d => d.id !== id)
      }
    } else {
      moodDiaries.value = moodDiaries.value.filter(d => d.id !== id)
    }
  }

  // 治愈生成相关方法
  function setHealingContent(content) {
    healingContent.value = content
    if (content) {
      healingHistory.value.unshift({ ...content, time: Date.now() })
      if (healingHistory.value.length > 50) healingHistory.value.pop()
    }
  }

  function removeHealingHistory(index) {
    healingHistory.value.splice(index, 1)
  }

  // 声音盲盒相关方法
  async function loadVoiceBoxFavorites() {
    if (window.electronAPI) {
      try {
        voiceBoxFavorites.value = await window.electronAPI.getVoiceBoxFavorites()
      } catch (e) {
        console.error('加载声音收藏失败:', e)
      }
    }
  }

  async function addVoiceBoxFavorite(item) {
    if (window.electronAPI) {
      try {
        await window.electronAPI.saveVoiceBoxFavorite(item)
        await loadVoiceBoxFavorites()
      } catch (e) {
        console.error('保存声音收藏失败:', e)
        voiceBoxFavorites.value.push(item)
      }
    } else {
      voiceBoxFavorites.value.push(item)
    }
  }

  async function removeVoiceBoxFavorite(id) {
    if (window.electronAPI) {
      try {
        await window.electronAPI.deleteVoiceBoxFavorite(id)
        await loadVoiceBoxFavorites()
      } catch (e) {
        console.error('删除声音收藏失败:', e)
        voiceBoxFavorites.value = voiceBoxFavorites.value.filter(f => f.id !== id)
      }
    } else {
      voiceBoxFavorites.value = voiceBoxFavorites.value.filter(f => f.id !== id)
    }
  }

  function setCurrentPlaying(playing) {
    currentPlaying.value = playing
  }

  // 云同步功能
  async function syncToCloud() {
    console.log('同步到云端')
    return true
  }

  async function syncFromCloud() {
    console.log('从云端同步')
    return true
  }

  return {
    // 状态
    theme,
    currentView,
    selectedEmotion,
    currentQuote,
    collections,
    customQuotes,
    moodDiaries,
    currentDiary,
    healingContent,
    healingHistory,
    voiceBoxFavorites,
    currentPlaying,
    settings,
    // 计算属性
    isDark,
    // 方法
    setTheme,
    setView,
    setEmotion,
    setQuote,
    loadCollections,
    addCollection,
    removeCollection,
    loadSettings,
    saveSettings,
    updateSettings,
    loadCustomQuotes,
    addCustomQuote,
    removeCustomQuote,
    loadMoodDiaries,
    saveMoodDiary,
    deleteMoodDiary,
    setHealingContent,
    removeHealingHistory,
    loadVoiceBoxFavorites,
    addVoiceBoxFavorite,
    removeVoiceBoxFavorite,
    setCurrentPlaying,
    syncToCloud,
    syncFromCloud
  }
})
