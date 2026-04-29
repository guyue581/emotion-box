<template>
  <div class="voice-box max-w-md mx-auto">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">🎧 声音盲盒</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">随机治愈音频，放松你的耳朵</p>
    </div>

    <!-- 当前播放 -->
    <div v-if="currentVoice" class="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-2xl shadow-lg p-4 mb-5">
      <div class="text-center">
        <!-- 波形动画 -->
        <div class="relative w-24 h-24 mx-auto mb-3">
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20 animate-ping"></div>
          <div class="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-30"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-4xl">{{ currentVoice.emoji }}</span>
          </div>
          <!-- 播放动画 -->
          <div v-if="isPlaying" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            <div v-for="i in 3" :key="i" class="w-0.5 bg-indigo-500 rounded-full animate-bounce" :style="{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.1}s` }"></div>
          </div>
        </div>

        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-1">{{ currentVoice.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ currentVoice.description }}</p>

        <!-- 进度条 -->
        <div class="mb-3">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ customDuration === 0 ? '∞' : formatTime(customDuration * 60) }}</span>
          </div>
          <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer" @click="seekAudio">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <!-- 控制区域：播放按钮 + 时长 + 音量 + 收藏 -->
        <div class="flex items-center justify-center gap-3 mb-3">
          <button @click="playPrevious" class="w-9 h-9 rounded-full bg-white/70 dark:bg-gray-700/70 text-gray-500 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center text-sm">
            ⏮️
          </button>
          <button 
            @click="togglePlay"
            class="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            :class="{ 'animate-pulse': isPlaying }"
          >
            {{ isPlaying ? '⏸️' : '▶️' }}
          </button>
          <button @click="playNext" class="w-9 h-9 rounded-full bg-white/70 dark:bg-gray-700/70 text-gray-500 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center text-sm">
            ⏭️
          </button>
        </div>

        <!-- 时长滑块 -->
        <div class="flex items-center gap-2 mb-1 px-2">
          <span class="text-xs text-gray-400">⏱️</span>
          <input 
            type="range" 
            min="0" 
            max="120" 
            step="1"
            v-model="customDuration"
            class="flex-1 h-1 accent-indigo-500"
          />
          <span class="text-xs text-gray-500 dark:text-gray-400 w-14 text-right">{{ customDuration === 0 ? '无限' : customDuration + '分' }}</span>
        </div>
        <p class="text-xs text-gray-400 px-2 mb-2">0 = 无限循环</p>

        <!-- 底部工具栏：音量 + 收藏 -->
        <div class="flex items-center justify-between px-2">
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-gray-400">🔈</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="volume"
              @input="setVolume"
              class="w-16 h-1 accent-indigo-500"
            />
            <span class="text-xs text-gray-400">🔊</span>
          </div>
          <button 
            @click="toggleFavorite"
            class="px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1"
            :class="isFavorite ? 'bg-pink-500 text-white' : 'bg-white/70 dark:bg-gray-700/70 text-gray-500 hover:text-pink-500'"
          >
            {{ isFavorite ? '❤️' : '🤍' }} {{ isFavorite ? '已收藏' : '收藏' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 随机抽取按钮 -->
    <button 
      v-if="!currentVoice"
      @click="randomPick"
      class="w-full py-4 mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <span class="text-xl mr-2">🎲</span>
      随机抽取一个声音
    </button>

    <!-- 重新抽取按钮 -->
    <div v-if="currentVoice" class="flex gap-3 mb-6">
      <button 
        @click="randomPick"
        class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        🎲 换一个
      </button>
      <button 
        @click="stopAndClose"
        class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        关闭
      </button>
    </div>

    <!-- 自定义音频输入 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">🔗 自定义音频</h3>
      
      <!-- 本地文件选择 -->
      <div class="mb-3">
        <label class="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
          <input 
            type="file" 
            accept="audio/*"
            @change="handleFileSelect"
            class="hidden"
          />
          <div class="text-center">
            <span class="text-2xl block mb-1">📁</span>
            <span class="text-sm text-gray-600 dark:text-gray-300">点击选择本地音频文件</span>
            <p class="text-xs text-gray-400 mt-1">支持 mp3, ogg, wav, m4a, flac</p>
          </div>
        </label>
        <p v-if="selectedFileName" class="text-xs text-indigo-500 mt-2">已选择: {{ selectedFileName }}</p>
      </div>
      
      <!-- 网络URL输入 -->
      <div class="flex gap-2">
        <input 
          v-model="customUrl"
          type="text" 
          placeholder="或输入音频URL (mp3/ogg/wav)"
          class="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          @click="playCustomUrl"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
        >
          播放
        </button>
      </div>
    </div>

    <!-- 分类选择 -->
    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">🎵 声音分类</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="switchCategory(category.value)"
          :class="[
            'px-3 py-2 rounded-xl text-sm transition-all',
            selectedCategory === category.value
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ category.emoji }} {{ category.label }}
        </button>
      </div>
    </div>

    <!-- 全部声音列表 -->
    <div class="all-voices">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">📋 全部声音</h3>
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="voice in filteredVoices" 
          :key="voice.name"
          @click="playVoice(voice)"
          :class="[
            'bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition-all text-center',
            currentVoice?.name === voice.name ? 'ring-2 ring-indigo-500' : ''
          ]"
        >
          <span class="text-3xl mb-2 block">{{ voice.emoji }}</span>
          <p class="font-medium text-gray-800 dark:text-white text-sm">{{ voice.name }}</p>
          <p class="text-xs text-gray-400">{{ voice.duration }}分钟</p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div 
      v-if="toast.show"
      class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()

// 声音分类
const categories = [
  { value: 'all', emoji: '🎵', label: '全部' },
  { value: 'nature', emoji: '🌿', label: '自然' },
  { value: 'music', emoji: '🎸', label: '轻音乐' },
  { value: 'white', emoji: '☁️', label: '白噪音' },
  { value: 'asmr', emoji: '🎧', label: 'ASMR' },
]

const voiceDefinitions = [
  { name: '雨后森林', emoji: '🌲', category: 'nature', description: '森林中的雨声，清新宁静', duration: 60, file: 'nature_rain_forest.mp3' },
  { name: '海浪声', emoji: '🌊', category: 'nature', description: '轻柔的海浪拍岸', duration: 60, file: 'nature_ocean_waves.mp3' },
  { name: '鸟鸣山间', emoji: '🐦', category: 'nature', description: '清晨山林中的鸟叫', duration: 60, file: 'nature_bird_songs.mp3' },
  { name: '溪流潺潺', emoji: '💧', category: 'nature', description: '山间小溪的流水声', duration: 60, file: 'nature_stream.mp3' },
  { name: '篝火噼啪', emoji: '🔥', category: 'nature', description: '温暖的篝火燃烧声', duration: 60, file: 'nature_campfire.mp3' },
  
  { name: '钢琴曲', emoji: '🎹', category: 'music', description: '轻柔的钢琴旋律', duration: 60, file: 'music_piano.mp3' },
  { name: '吉他弹唱', emoji: '🎸', category: 'music', description: '温馨的吉他曲', duration: 60, file: 'music_guitar.mp3' },
  { name: '古典音乐', emoji: '🎻', category: 'music', description: '舒缓的古典乐章', duration: 60, file: 'music_classical.mp3' },
  { name: '冥想音乐', emoji: '🧘', category: 'music', description: '深度放松冥想曲', duration: 60, file: 'music_meditation.mp3' },
  
  { name: '粉红噪音', emoji: '💗', category: 'white', description: '助眠粉红噪音', duration: 60, file: 'white_pink_noise.mp3' },
  { name: '风扇声', emoji: '🌀', category: 'white', description: '模拟风扇转动的白噪音', duration: 60, file: 'white_fan.mp3' },
  { name: '咖啡厅', emoji: '☕', category: 'white', description: '咖啡厅的背景音', duration: 60, file: 'white_coffee_shop.mp3' },
  { name: '图书馆', emoji: '📚', category: 'white', description: '安静的图书馆氛围', duration: 60, file: 'white_library.mp3' },
  
  { name: '敲击声', emoji: '🔔', category: 'asmr', description: '舒缓的敲击ASMR', duration: 60, file: 'asmr_tapping.mp3' },
  { name: '书写声', emoji: '✏️', category: 'asmr', description: '笔尖书写的ASMR', duration: 60, file: 'asmr_writing.mp3' },
  { name: '翻书声', emoji: '📖', category: 'asmr', description: '翻页的沙沙声', duration: 60, file: 'asmr_page_turn.mp3' },
]

const audioBasePath = ref('./audio/')
const allVoices = computed(() => 
  voiceDefinitions.map(v => ({
    ...v,
    url: audioBasePath.value + v.file
  }))
)

// 状态
const selectedCategory = ref('all')
const currentVoice = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const customDuration = ref(10)
const volume = ref(70)
const favorites = ref([])
const currentIndex = ref(-1)
const customUrl = ref('')
const selectedFileName = ref('')
const selectedFileUrl = ref('')

let audioElement = null
let progressInterval = null
let toastTimer = null

const toast = ref({
  show: false,
  message: ''
})

// 计算属性
const filteredVoices = computed(() => {
  if (selectedCategory.value === 'all') return allVoices.value
  return allVoices.value.filter(v => v.category === selectedCategory.value)
})

const progress = computed(() => {
  if (!currentVoice.value) return 0
  if (customDuration.value === 0) {
    if (audioElement && audioElement.duration && isFinite(audioElement.duration)) {
      return (audioElement.currentTime / audioElement.duration) * 100
    }
    return 0
  }
  return (currentTime.value / (customDuration.value * 60)) * 100
})

const isFavorite = computed(() => {
  if (!currentVoice.value) return false
  return favorites.value.some(f => f.name === currentVoice.value.name)
})

// 方法
function showToast(message) {
  toast.value = { show: true, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

function switchCategory(category) {
  stopAudio()
  selectedCategory.value = category
  currentVoice.value = null
}

function randomPick() {
  const filtered = selectedCategory.value === 'all' 
    ? allVoices.value 
    : allVoices.value.filter(v => v.category === selectedCategory.value)
  
  const randomIndex = Math.floor(Math.random() * filtered.length)
  playVoice(filtered[randomIndex])
}

function playVoice(voice) {
  stopAudio()
  
  currentVoice.value = voice
  currentIndex.value = filteredVoices.value.findIndex(v => v.name === voice.name)
  currentTime.value = 0
  
  if (voice.url) {
    audioElement = new Audio(voice.url)
    audioElement.volume = volume.value / 100
    audioElement.loop = true
    audioElement.play().then(() => {
      isPlaying.value = true
      progressInterval = setInterval(() => {
        currentTime.value++
        if (customDuration.value > 0 && currentTime.value >= customDuration.value * 60) {
          stopAudio()
        }
      }, 1000)
    }).catch(err => {
      console.error('音频播放失败:', err)
      showToast('音频加载失败，请尝试其他声音')
      currentVoice.value = null
      currentIndex.value = -1
    })
  } else {
    showToast('该声音暂无音频')
  }
  
  store.setCurrentPlaying(voice)
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // 释放之前的URL
  if (selectedFileUrl.value) {
    URL.revokeObjectURL(selectedFileUrl.value)
  }
  
  selectedFileName.value = file.name
  selectedFileUrl.value = URL.createObjectURL(file)
  
  // 自动播放选中的文件
  playCustomAudio(selectedFileUrl.value, file.name)
}

function playCustomUrl() {
  if (!customUrl.value) {
    showToast('请输入音频URL')
    return
  }
  
  playCustomAudio(customUrl.value, '网络音频')
}

function playCustomAudio(url, name) {
  stopAudio()
  
  const voice = {
    name: name || '自定义音频',
    emoji: '🎵',
    category: 'custom',
    description: '用户自定义音频',
    duration: customDuration.value,
    url: url
  }
  
  currentVoice.value = voice
  currentTime.value = 0
  
  audioElement = new Audio(url)
  audioElement.volume = volume.value / 100
  audioElement.loop = true
  audioElement.play().then(() => {
    isPlaying.value = true
    progressInterval = setInterval(() => {
      currentTime.value++
      if (customDuration.value > 0 && currentTime.value >= customDuration.value * 60) {
        stopAudio()
      }
    }, 1000)
  }).catch(err => {
    console.error('音频播放失败:', err)
    showToast('音频加载失败，请检查文件或URL')
    currentVoice.value = null
  })
}

function playFavorite(item) {
  const voice = allVoices.find(v => v.name === item.name)
  if (voice) {
    playVoice(voice)
  } else if (item.url) {
    playCustomAudio(item.url, item.name)
  } else {
    showToast('该音频暂不可用')
  }
}

function playNext() {
  const filtered = filteredVoices.value
  if (filtered.length === 0) return
  
  currentIndex.value = (currentIndex.value + 1) % filtered.length
  playVoice(filtered[currentIndex.value])
}

function playPrevious() {
  const filtered = filteredVoices.value
  if (filtered.length === 0) return
  
  currentIndex.value = currentIndex.value <= 0 
    ? filtered.length - 1 
    : currentIndex.value - 1
  playVoice(filtered[currentIndex.value])
}

function togglePlay() {
  if (isPlaying.value) {
    pauseAudio()
  } else {
    resumeAudio()
  }
}

function pauseAudio() {
  if (audioElement) {
    audioElement.pause()
  }
  isPlaying.value = false
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

function resumeAudio() {
  if (audioElement) {
    audioElement.play().then(() => {
      isPlaying.value = true
      progressInterval = setInterval(() => {
        currentTime.value++
        // 0表示无限循环，不自动停止
        if (customDuration.value > 0 && currentTime.value >= customDuration.value * 60) {
          stopAudio()
        }
      }, 1000)
    })
  }
}

function stopAudio() {
  if (audioElement) {
    audioElement.pause()
    audioElement.src = ''
    audioElement = null
  }
  isPlaying.value = false
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

function cleanupFileUrl() {
  if (selectedFileUrl.value) {
    URL.revokeObjectURL(selectedFileUrl.value)
    selectedFileUrl.value = ''
    selectedFileName.value = ''
  }
}

function stopAndClose() {
  stopAudio()
  currentVoice.value = null
}

function seekAudio(event) {
  if (!currentVoice.value || !audioElement) return
  if (customDuration.value === 0) return
  
  const rect = event.target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const newTime = Math.floor(customDuration.value * 60 * percent)
  currentTime.value = newTime
  if (audioElement.duration && isFinite(audioElement.duration)) {
    audioElement.currentTime = (percent * audioElement.duration)
  }
}

function setVolume() {
  if (audioElement) {
    audioElement.volume = volume.value / 100
  }
}

function toggleFavorite() {
  if (!currentVoice.value) return
  
  const exists = favorites.value.find(f => f.name === currentVoice.value.name)
  if (exists) {
    removeFavorite(exists.id)
  } else {
    addToFavorites()
  }
}

async function addToFavorites() {
  const item = {
    id: Date.now().toString(),
    name: currentVoice.value.name,
    emoji: currentVoice.value.emoji,
    duration: currentVoice.value.duration,
    url: currentVoice.value.url,
    category: currentVoice.value.category
  }
  
  favorites.value.push(item)
  await store.addVoiceBoxFavorite(item)
  
  // 同时添加到统一收藏列表，以便在收藏页面显示
  await store.addCollection({
    id: item.id,
    type: 'voice',
    name: item.name,
    emoji: item.emoji,
    category: item.category,
    url: item.url,
    source: 'local'
  })
  
  showToast('已收藏~')
}

async function removeFavorite(id) {
  favorites.value = favorites.value.filter(f => f.id !== id)
  await store.removeVoiceBoxFavorite(id)
  // 同时从统一收藏列表中删除
  await store.removeCollection(id)
}

function formatTime(seconds) {
  if (typeof seconds !== 'number' || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

// 初始化
onMounted(async () => {
  if (window.electronAPI && window.electronAPI.getAudioBasePath) {
    try {
      const basePath = await window.electronAPI.getAudioBasePath()
      audioBasePath.value = basePath
    } catch (e) {
      console.error('获取音频路径失败:', e)
    }
  }
  await store.loadVoiceBoxFavorites()
  favorites.value = [...store.voiceBoxFavorites]
})

onUnmounted(() => {
  stopAudio()
  cleanupFileUrl()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
