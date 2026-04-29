<template>
  <div class="max-w-md mx-auto py-8">
    <!-- 标题 -->
    <div class="text-center mb-10 animate-fade-in">
      <div class="text-5xl mb-4 animate-bounce-light">✨</div>
      <h1 class="text-2xl font-bold text-gradient animate-fade-in animate-delay-100">你的治愈签</h1>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-2 animate-fade-in animate-delay-200">
        专属你的心灵治愈礼物
      </p>
    </div>

    <!-- 语录卡片 -->
    <div class="mb-10 animate-fade-in animate-delay-100 relative overflow-hidden"
         :class="[
           'quote-card rounded-2xl p-6 shadow-lg backdrop-blur-sm border transition-all duration-500',
           store.currentQuote?.source === 'ai' 
             ? 'ai-quote-card bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-purple-300/50 dark:border-purple-600/50 shadow-purple-200/50 dark:shadow-purple-800/30' 
             : 'bg-white/95 dark:bg-dark-card/95 border-white/20 dark:border-dark-card/30'
         ]">
      <!-- AI特效光晕 -->
      <div v-if="store.currentQuote?.source === 'ai'" class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-0 w-32 h-32 bg-pink-400/15 rounded-full blur-2xl animate-pulse" style="animation-delay: 0.5s;"></div>
        <div class="absolute top-1/2 left-0 w-24 h-24 bg-blue-400/15 rounded-full blur-2xl animate-pulse" style="animation-delay: 1s;"></div>
        <!-- AI星星装饰 -->
        <div class="absolute top-4 right-4 text-purple-400 animate-spin-slow text-lg">✨</div>
        <div class="absolute bottom-8 left-6 text-pink-400 animate-bounce text-sm" style="animation-delay: 0.3s;">⭐</div>
        <div class="absolute top-12 left-8 text-blue-400 animate-pulse text-xs" style="animation-delay: 0.7s;">💫</div>
      </div>
      
      <!-- 卡片内容 -->
      <div class="relative z-10">
        <!-- 语录内容 -->
        <div class="text-center py-6">
          <!-- AI特殊标记 - 更明显的顶部徽章 -->
          <div v-if="store.currentQuote?.source === 'ai'" 
               class="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-purple-300/50 dark:shadow-purple-800/50 animate-pulse-scale">
            <span class="text-lg animate-bounce">🤖</span>
            <span>AI 智能生成</span>
            <span class="text-lg animate-bounce" style="animation-delay: 0.2s;">✨</span>
          </div>
          
          <!-- 引号装饰 -->
          <div class="text-5xl mb-4 animate-fade-in animate-delay-200"
               :class="store.currentQuote?.source === 'ai' ? 'text-purple-400' : 'text-primary-300 dark:text-primary-700'">
            "
          </div>
          
          <p class="text-xl leading-relaxed mb-6 animate-fade-in animate-delay-300 font-medium"
             :class="store.currentQuote?.source === 'ai' ? 'text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-200'">
            {{ store.currentQuote.text }}
          </p>
          
          <!-- 引号装饰 -->
          <div class="text-5xl mb-6 animate-fade-in animate-delay-400"
               :class="store.currentQuote?.source === 'ai' ? 'text-purple-400' : 'text-primary-300 dark:text-primary-700'">
            "
          </div>
          
          <!-- 情绪标签 -->
          <div class="emotion-tag animate-fade-in animate-delay-500">
            <span>{{ emotionInfo.emoji }}</span>
            <span>{{ emotionInfo.label }}</span>
          </div>
          
          <!-- 本地语录来源标签 -->
          <div v-if="store.currentQuote?.source !== 'ai'" class="mt-5 flex justify-center">
            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              <span>📚</span>
              <span>本地语录库</span>
            </span>
          </div>
          
          <!-- AI语录提示 - 更明显的底部提示 -->
          <div v-if="store.currentQuote?.source === 'ai'" class="mt-5">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700">
              <span class="text-purple-600 dark:text-purple-400 text-xs flex items-center gap-1.5 font-medium">
                <span class="animate-pulse">🧠</span>
                <span>这句治愈语录由 AI 为你量身定制</span>
                <span class="animate-pulse" style="animation-delay: 0.5s;">💜</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-4 justify-center animate-fade-in animate-delay-200">
      <button
        @click="toggleFavorite"
        :class="[
          'flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-1',
          isFavorited 
            ? 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400 shadow-sm' 
            : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:shadow-md'
        ]"
      >
        <span :class="isFavorited ? 'animate-pulse' : ''">{{ isFavorited ? '❤️' : '🤍' }}</span>
        <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
      </button>
      
      <button
        @click="tryAgain"
        class="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        <span class="animate-spin-slow">🔄</span>
        <span>再抽一次</span>
      </button>
      
      <button
        @click="showShareOptions = true"
        class="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        <span>📤</span>
        <span>分享</span>
      </button>
      
      <!-- AI对话按钮（仅在配置API后显示） -->
      <button
        v-if="store.settings?.apiType && store.settings.apiType !== 'none'"
        @click="showAIChat = true"
        class="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-pulse"
      >
        <span>💬</span>
        <span>和AI聊聊</span>
      </button>
      
      <!-- 分享选项 -->
      <div v-if="showShareOptions" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showShareOptions = false">
        <div class="bg-white dark:bg-dark-card rounded-2xl p-6 mx-4 animate-scale-in shadow-2xl w-full max-w-md">
          <h3 class="text-lg font-bold mb-4 text-center">分享到</h3>
          <div class="grid grid-cols-4 gap-4">
            <button @click="shareTo('wechat')" class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span class="text-2xl">💬</span>
              <span class="text-xs">微信</span>
            </button>
            <button @click="shareTo('weibo')" class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span class="text-2xl">📱</span>
              <span class="text-xs">微博</span>
            </button>
            <button @click="shareTo('copy')" class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span class="text-2xl">📋</span>
              <span class="text-xs">复制</span>
            </button>
            <button @click="shareTo('more')" class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span class="text-2xl">⋯</span>
              <span class="text-xs">更多</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享提示 -->
    <div v-if="showShareTip" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showShareTip = false">
      <div class="bg-white dark:bg-dark-card rounded-2xl p-6 mx-4 animate-scale-in text-center shadow-2xl">
        <div class="text-4xl mb-4 animate-bounce-light">📋</div>
        <p class="text-lg mb-2">语录已复制到剪贴板</p>
        <p class="text-sm text-gray-500">快去分享给朋友吧！</p>
      </div>
    </div>
  </div>
  
  <!-- AI对话组件（独立层级） -->
  <AIChat v-if="showAIChat" :emotion="store.currentQuote?.emotion || ''" @close="showAIChat = false" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { emotionMap } from '../assets/quotes'
import confetti from 'canvas-confetti'
import AIChat from './AIChat.vue'

const store = useAppStore()

const isFavorited = ref(false)
const showShareTip = ref(false)
const showShareOptions = ref(false)
const showAIChat = ref(false)

// 定时器ID，用于组件卸载时清理
let confettiTimer1 = null
let confettiTimer2 = null
let shareTipTimer = null

const emotionInfo = computed(() => {
  const emotion = store.currentQuote?.emotion
  if (emotion && emotionMap[emotion]) {
    return emotionMap[emotion]
  }
  return { emoji: '💝', label: '治愈' }
})

onMounted(() => {
  // 检查是否已收藏
  checkIfFavorited()
  
  // 显示小烟花庆祝
  confettiTimer1 = setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b']
    })
  }, 300)
  
  // 再次触发烟花效果
  confettiTimer2 = setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f5576c', '#ff9a9e', '#fad0c4', '#fecfef', '#f9f0ff']
    })
  }, 800)
})

onUnmounted(() => {
  if (confettiTimer1) clearTimeout(confettiTimer1)
  if (confettiTimer2) clearTimeout(confettiTimer2)
  if (shareTipTimer) clearTimeout(shareTipTimer)
})

function checkIfFavorited() {
  if (store.currentQuote?.id) {
    isFavorited.value = store.collections.some(c => c.id === store.currentQuote.id)
  }
}

async function toggleFavorite() {
  if (!store.currentQuote) return
  
  if (isFavorited.value) {
    await store.removeCollection(store.currentQuote.id)
    isFavorited.value = false
  } else {
    // 确保收藏数据有完整字段
    const collectionData = {
      ...store.currentQuote,
      type: 'quote'
    }
    await store.addCollection(collectionData)
    isFavorited.value = true
    
    // 收藏动画
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff6b6b', '#ee5a6f', '#ff8787', '#ffd93d', '#6bcb77']
    })
  }
}

function tryAgain() {
  store.setView('boxOpen')
}

function shareTo(platform) {
  if (!store.currentQuote) return
  
  const text = `✨ 情绪盲盒治愈签 ✨\n\n"${store.currentQuote.text}"\n\n—— 来自情绪盲盒 App`
  const url = window.location.origin
  
  showShareOptions.value = false
  
  switch (platform) {
    case 'wechat':
      // 微信分享（复制到剪贴板让用户手动分享）
      copyToClipboard(text)
      break
    case 'weibo':
      // 微博分享
      const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
      window.open(weiboUrl, '_blank', 'width=600,height=400')
      break
    case 'copy':
      // 复制到剪贴板
      copyToClipboard(text)
      break
    case 'more':
      // 更多分享选项（使用Web Share API）
      if (navigator.share) {
        navigator.share({
          title: '情绪盲盒治愈签',
          text: text,
          url: url
        }).catch(err => {
          console.error('分享失败:', err)
          copyToClipboard(text)
        })
      } else {
        // 降级处理
        copyToClipboard(text)
      }
      break
  }
}

function copyToClipboard(text) {
  // 复制到剪贴板
  navigator.clipboard.writeText(text).then(() => {
    showShareTip.value = true
    if (shareTipTimer) clearTimeout(shareTipTimer)
    shareTipTimer = setTimeout(() => {
      showShareTip.value = false
    }, 2000)
  }).catch(() => {
    // 降级处理
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showShareTip.value = true
    if (shareTipTimer) clearTimeout(shareTipTimer)
    shareTipTimer = setTimeout(() => {
      showShareTip.value = false
    }, 2000)
  })
}
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
