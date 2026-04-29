<template>
  <div 
    :class="[`theme-${store.theme}`]"
    class="h-screen transition-colors duration-500 overflow-hidden"
    @mousemove="handleMouseMove"
  >
    <div class="h-full relative overflow-hidden flex flex-col">
      <!-- 背景图片 -->
      <div class="absolute inset-0 z-0">
        <!-- 自定义背景图片 -->
        <div v-if="store.settings?.backgroundType === 'custom' && store.settings?.backgroundImage" 
             class="w-full h-full bg-image transition-transform duration-500"
             :style="{ backgroundImage: `url(${store.settings.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>
        
        <!-- 动态背景 -->
        <div v-else-if="store.settings?.backgroundType === 'dynamic'" 
             class="w-full h-full bg-image transition-transform duration-500"
             :class="store.settings?.dynamicBackground === 'flow' ? 'animate-gradient-flow' : ''">
          <div v-if="store.settings?.dynamicBackground === 'flow'" 
               class="w-full h-full bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-primary-500/20">
          </div>
        </div>
        
        <!-- 默认背景 -->
        <div v-else>
          <img 
            v-if="store.theme === 'light' " 
            src="/bg-light.svg" 
            alt="背景" 
            class="w-full h-full object-cover bg-image transition-transform duration-500"
          />
          <img 
            v-else-if="store.theme === 'dark' " 
            src="/bg-dark.svg" 
            alt="背景" 
            class="w-full h-full object-cover bg-image transition-transform duration-500"
          />
          <div v-else-if="store.theme === 'forest'" class="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'ocean'" class="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'starry'" class="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'sunset'" class="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'dream'" class="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'minimal'" class="w-full h-full bg-gradient-to-br from-white to-gray-100 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'vintage'" class="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-50 bg-image transition-transform duration-500"></div>
          <div v-else-if="store.theme === 'custom'" class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 bg-image transition-transform duration-500"></div>
        </div>
      </div>
      <div class="absolute inset-0 bg-theme-light-bg/80 
                 theme-dark:bg-theme-dark-bg/80 
                 theme-forest:bg-theme-forest-bg/80 
                 theme-ocean:bg-theme-ocean-bg/80 
                 theme-starry:bg-theme-starry-bg/80 
                 theme-sunset:bg-theme-sunset-bg/80 
                 theme-dream:bg-theme-dream-bg/80 
                 theme-minimal:bg-theme-minimal-bg/80 
                 theme-vintage:bg-theme-vintage-bg/80 
                 theme-custom:bg-theme-custom-bg/80 
                 z-10"></div>
      <div class="relative z-20 h-full flex flex-col">
      <!-- 动态背景粒子 -->
      <canvas ref="particlesCanvas" class="absolute inset-0 z-0 pointer-events-none"></canvas>
      
      <!-- 顶部导航 -->
      <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 
                 theme-dark:bg-theme-dark-card/80 theme-dark:border-gray-800
                 theme-forest:bg-white/80 theme-forest:border-gray-100
                 theme-ocean:bg-white/80 theme-ocean:border-gray-100
                 theme-starry:bg-theme-starry-card/80 theme-starry:border-gray-800
                 theme-sunset:bg-white/80 theme-sunset:border-gray-100
                 theme-dream:bg-white/80 theme-dream:border-gray-100
                 theme-minimal:bg-white/80 theme-minimal:border-gray-100
                 theme-vintage:bg-white/80 theme-vintage:border-gray-100
                 theme-custom:bg-white/80 theme-custom:border-gray-100
                 backdrop-blur-lg border-b border-gray-100 transition-all duration-300
                 shadow-sm hover:shadow-md">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div class="text-lg font-bold text-gradient animate-pulse-scale cursor-pointer" @click="goHome">
            ✨ 情绪盲盒
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="goHome"
              :class="[
                'p-2 rounded-full transition-all duration-300 relative overflow-hidden',
                store.currentView === 'home' 
                  ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              ]"
              title="首页"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </button>
            <button 
              @click="goCollection"
              :class="[
                'p-2 rounded-full transition-all duration-300 relative overflow-hidden',
                store.currentView === 'collection' 
                  ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              ]"
              title="收藏"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
            <button 
              @click="goSettings"
              :class="[
                'p-2 rounded-full transition-all duration-300 relative overflow-hidden',
                store.currentView === 'settings' 
                  ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              ]"
              title="设置"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-y-auto pt-16 pb-20 px-4 relative z-10" style="min-height: 0;">
        <transition name="page">
          <Home v-if="store.currentView === 'home'" @select-emotion="handleEmotionSelect" :key="'home'" />
          <BoxOpen v-else-if="store.currentView === 'boxOpen'" :key="'boxOpen'" />
          <Result v-else-if="store.currentView === 'result'" :key="'result'" />
          <Collection v-else-if="store.currentView === 'collection'" :key="'collection'" />
          <MoodDiary v-else-if="store.currentView === 'diary'" :key="'diary'" />
          <HealingGenerator v-else-if="store.currentView === 'healing'" :key="'healing'" />
          <VoiceBox v-else-if="store.currentView === 'voiceBox'" :key="'voiceBox'" />
          <Settings v-else-if="store.currentView === 'settings'" :key="'settings'" />
        </transition>
      </main>
      
      <!-- 底部导航栏（移动端友好） -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-card/90 backdrop-blur-lg
                border-t border-gray-100 dark:border-gray-800 shadow-lg
                transition-all duration-300 md:hidden">
        <div class="max-w-md mx-auto flex items-center justify-around py-3">
          <button 
            @click="goHome"
            :class="[
              'flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300',
              store.currentView === 'home' 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            title="首页"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-xs">首页</span>
          </button>
          <button 
            @click="goDiary"
            :class="[
              'flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300',
              store.currentView === 'diary' 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            title="日记"
          >
            <span class="text-lg">📔</span>
            <span class="text-xs">日记</span>
          </button>
          <button 
            @click="goHealing"
            :class="[
              'flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300',
              store.currentView === 'healing' 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            title="治愈"
          >
            <span class="text-lg">🌈</span>
            <span class="text-xs">治愈</span>
          </button>
          <button 
            @click="goVoiceBox"
            :class="[
              'flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300',
              store.currentView === 'voiceBox' 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            title="声音"
          >
            <span class="text-lg">🎧</span>
            <span class="text-xs">声音</span>
          </button>
          <button 
            @click="goCollection"
            :class="[
              'flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300',
              store.currentView === 'collection' 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            title="收藏"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span class="text-xs">收藏</span>
          </button>
          <button 
            @click="goSettings"
            :class="[
              'flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300',
              store.currentView === 'settings' 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            title="设置"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-xs">设置</span>
          </button>
        </div>
      </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from './stores/app'
import Home from './components/Home.vue'
import BoxOpen from './components/BoxOpen.vue'
import Result from './components/Result.vue'
import Collection from './components/Collection.vue'
import MoodDiary from './components/MoodDiary.vue'
import HealingGenerator from './components/HealingGenerator.vue'
import VoiceBox from './components/VoiceBox.vue'
import Settings from './components/Settings.vue'

const store = useAppStore()
const particlesCanvas = ref(null)
let animationId = null
let particles = []

// 初始化粒子效果
function initParticles() {
  if (!particlesCanvas.value) return
  
  const canvas = particlesCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 设置canvas尺寸
  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 创建粒子
  function createParticles() {
    particles = []
    const particleCount = window.innerWidth < 768 ? 20 : 40
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      })
    }
  }
  createParticles()
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const particleColor = getParticleColor()
    
    particles.forEach(particle => {
      // 更新位置
      particle.x += particle.speedX
      particle.y += particle.speedY
      
      // 边界检查
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      
      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      const r = parseInt(particleColor.slice(1, 3), 16)
      const g = parseInt(particleColor.slice(3, 5), 16)
      const b = parseInt(particleColor.slice(5, 7), 16)
      ctx.fillStyle = `rgba(${r},${g},${b},${particle.opacity})`
      ctx.fill()
    })
    
    animationId = requestAnimationFrame(animate)
  }
  animate()
}

// 重置粒子
function resetParticles() {
  const canvas = particlesCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  particles.forEach(particle => {
    particle.x = Math.random() * canvas.width
    particle.y = Math.random() * canvas.height
  })
}

// 根据主题获取粒子颜色
function getParticleColor() {
  switch (store.theme) {
    case 'dark':
      return '#818cf8'
    case 'forest':
      return '#38a169'
    case 'ocean':
      return '#3182ce'
    case 'starry':
      return '#9f7aea'
    case 'sunset':
      return '#ed8936'
    case 'dream':
      return '#9f7aea'
    case 'minimal':
      return '#64748b'
    case 'vintage':
      return '#d97706'
    case 'custom':
      return store.settings?.customPrimaryColor || '#667eea'
    default:
      return '#667eea'
  }
}

// 处理鼠标移动，实现背景交互效果
function handleMouseMove(event) {
  const mouseX = event.clientX / window.innerWidth
  const mouseY = event.clientY / window.innerHeight
  
  // 移动背景图片
  const bgElements = document.querySelectorAll('.bg-image')
  bgElements.forEach(el => {
    el.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`
  })
  
  // 调整粒子效果
  particles.forEach(particle => {
    const distanceX = (mouseX - 0.5) * 0.5
    const distanceY = (mouseY - 0.5) * 0.5
    particle.x += distanceX * 0.1
    particle.y += distanceY * 0.1
  })
}

// 页面跳转
function goHome() {
  store.setView('home')
}

function goDiary() {
  store.setView('diary')
}

function goHealing() {
  store.setView('healing')
}

function goVoiceBox() {
  store.setView('voiceBox')
}

function goCollection() {
  store.setView('collection')
}

function goSettings() {
  store.setView('settings')
}

function handleEmotionSelect(emotion) {
  store.setEmotion(emotion)
  store.setView('boxOpen')
}

onMounted(async () => {
  await store.loadSettings()
  await store.loadCollections()
  await store.loadCustomQuotes()
  
  // 应用保存的主题
  const themes = ['light', 'dark', 'forest', 'ocean', 'starry', 'sunset', 'dream', 'minimal', 'vintage', 'custom']
  themes.forEach(theme => {
    document.documentElement.classList.remove(`theme-${theme}`)
  })
  document.documentElement.classList.add(`theme-${store.theme}`)
  
  // 应用自定义主题颜色
  if (store.settings?.customPrimaryColor) {
    document.documentElement.style.setProperty('--custom-primary', store.settings.customPrimaryColor)
  }
  if (store.settings?.customSecondaryColor) {
    document.documentElement.style.setProperty('--custom-secondary', store.settings.customSecondaryColor)
  }
  
  // 初始化粒子效果
  initParticles()
  
  // 监听主题变化
  watch(() => store.theme, () => {
    resetParticles()
  })
})

// 清理资源
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
/* 页面切换动画已在全局 style.css 中定义 */
</style>
