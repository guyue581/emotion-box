<template>
  <div class="max-w-md mx-auto py-6">
    <!-- 标题区域 -->
    <div class="text-center mb-6 animate-fade-in">
      <div class="text-4xl mb-3">✨</div>
      <h1 class="text-2xl font-bold text-gradient mb-2">情绪盲盒</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm">探索内心世界，发现治愈的力量</p>
    </div>

    <!-- 功能入口卡片 -->
    <div class="mb-6 animate-fade-in animate-delay-100">
      <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">探索功能</h2>
      <div class="grid grid-cols-2 gap-3">
        <!-- 情绪盲盒 -->
        <div 
          class="card cursor-pointer hover:scale-105 transition-transform duration-300"
          @click="scrollToBoxSection"
        >
          <div class="text-2xl mb-2">🎁</div>
          <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">情绪盲盒</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">随机治愈内容</div>
        </div>
        
        <!-- 心情日记 -->
        <div 
          class="card cursor-pointer hover:scale-105 transition-transform duration-300"
          @click="goDiary"
        >
          <div class="text-2xl mb-2">📔</div>
          <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">心情日记</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">记录+AI分析</div>
        </div>
        
        <!-- 治愈 -->
        <div 
          class="card cursor-pointer hover:scale-105 transition-transform duration-300"
          @click="goHealing"
        >
          <div class="text-2xl mb-2">🌈</div>
          <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">治愈</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">生成治愈内容</div>
        </div>
        
        <!-- 声音盲盒 -->
        <div 
          class="card cursor-pointer hover:scale-105 transition-transform duration-300"
          @click="goVoiceBox"
        >
          <div class="text-2xl mb-2">🎧</div>
          <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">声音盲盒</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">白噪音·轻音乐</div>
        </div>
      </div>
    </div>

    <!-- 情绪选择区域 -->
    <div id="box-section" class="card mb-6 animate-fade-in animate-delay-200">
      <h2 class="text-lg font-medium text-center mb-4 text-gray-700 dark:text-gray-200">
        今天的心情是？
      </h2>
      
      <!-- 情绪按钮网格 -->
      <div class="grid grid-cols-4 gap-2 mb-5">
        <button
          v-for="emotion in emotions"
          :key="emotion.key"
          @click="selectEmotion(emotion.key)"
          :class="[
            'emotion-btn flex flex-col items-center gap-1 py-3 px-2',
            selectedEmotion === emotion.key ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30' : ''
          ]"
        >
          <span class="text-xl">{{ emotion.emoji }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ emotion.label }}</span>
        </button>
      </div>

      <!-- 自定义输入 -->
      <div class="mb-5">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">或者输入你的心情...</p>
        <input
          v-model="customEmotion"
          type="text"
          placeholder="描述你的心情..."
          class="input-field text-center"
          @keyup.enter="handleCustomEmotion"
        />
      </div>

      <!-- 开始按钮 -->
      <button
        @click="startBox"
        :disabled="!selectedEmotion && !customEmotion.trim()"
        class="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        开启盲盒 🎁
      </button>
    </div>

    <!-- 快捷统计 -->
    <div class="card animate-fade-in animate-delay-300" v-if="diaryStats.total > 0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-2xl">📊</div>
          <div>
            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">你的情绪数据</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ diaryStats.total }}篇日记 · 记录{{ diaryStats.days }}天</div>
          </div>
        </div>
        <button @click="goDiary" class="text-primary-500 text-sm">查看 →</button>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="text-center text-sm text-gray-400 dark:text-gray-500 mt-6 animate-fade-in animate-delay-400">
      <p>💡 提示：选择一个情绪，开启专属于你的治愈语录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { getAllEmotions } from '../assets/quotes'

const emit = defineEmits(['select-emotion'])
const store = useAppStore()

const emotions = getAllEmotions()
const selectedEmotion = ref('')
const customEmotion = ref('')

// 统计日记数据
const diaryStats = computed(() => {
  const diaries = store.moodDiaries || []
  if (diaries.length === 0) return { total: 0, days: 0 }
  
  const dates = [...new Set(diaries.map(d => d.date))]
  return {
    total: diaries.length,
    days: dates.length
  }
})

function selectEmotion(emotion) {
  selectedEmotion.value = emotion
  customEmotion.value = ''
}

function handleCustomEmotion() {
  if (customEmotion.value.trim()) {
    selectedEmotion.value = 'custom'
  }
}

function startBox() {
  const emotion = customEmotion.value.trim() || selectedEmotion.value
  if (emotion) {
    store.setEmotion(emotion)
    emit('select-emotion', emotion)
  }
}

// 导航到各功能
function goDiary() {
  store.setView('diary')
}

function goHealing() {
  store.setView('healing')
}

function goVoiceBox() {
  store.setView('voiceBox')
}

// 滚动到盲盒区域
function scrollToBoxSection() {
  const section = document.getElementById('box-section')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 加载日记数据
onMounted(() => {
  if (window.electronAPI) {
    window.electronAPI.getMoodDiaries().then(diaries => {
      if (diaries && diaries.length > 0) {
        store.moodDiaries = diaries
      }
    })
  }
})
</script>

<style scoped>
.card {
  @apply bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700/50;
}

.input-field {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-700 dark:text-gray-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95;
}

.text-gradient {
  @apply bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent;
}
</style>
